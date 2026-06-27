#!/usr/bin/env bun
import plugin from "bun-plugin-tailwind";
import type { BunPlugin } from "bun";
import { existsSync } from "fs";
import { rm, copyFile } from "fs/promises";
import path from "path";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
🏗️  Bun Build Script

Usage: bun run build.ts [options]

Common Options:
  --outdir <path>          Output directory (default: "dist")
  --minify                 Enable minification (or --minify.whitespace, --minify.syntax, etc)
  --sourcemap <type>      Sourcemap type: none|linked|inline|external
  --target <target>        Build target: browser|bun|node
  --format <format>        Output format: esm|cjs|iife
  --splitting              Enable code splitting
  --packages <type>        Package handling: bundle|external
  --public-path <path>     Public path for assets
  --env <mode>             Environment handling: inline|disable|prefix*
  --conditions <list>      Package.json export conditions (comma separated)
  --external <list>        External packages (comma separated)
  --banner <text>          Add banner text to output
  --footer <text>          Add footer text to output
  --define <obj>           Define global constants (e.g. --define.VERSION=1.0.0)
  --help, -h               Show this help message

Example:
  bun run build.ts --outdir=dist --minify --sourcemap=linked --external=react,react-dom
`);
  process.exit(0);
}

const toCamelCase = (str: string): string =>
  str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const parseValue = (value: string): any => {
  if (value === "true") return true;
  if (value === "false") return false;

  if (/^\d+$/.test(value)) return parseInt(value, 10);
  if (/^\d*\.\d+$/.test(value)) return parseFloat(value);

  if (value.includes(",")) return value.split(",").map((v) => v.trim());

  return value;
};

function parseArgs(): Partial<Bun.BuildConfig> {
  const config: Partial<Bun.BuildConfig> = {};
  const args = process.argv.slice(2);

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === undefined) continue;
    if (!arg.startsWith("--")) continue;

    if (arg.startsWith("--no-")) {
      const key = toCamelCase(arg.slice(5));
      config[key] = false;
      continue;
    }

    if (
      !arg.includes("=") &&
      (i === args.length - 1 || args[i + 1]?.startsWith("--"))
    ) {
      const key = toCamelCase(arg.slice(2));
      config[key] = true;
      continue;
    }

    let key: string;
    let value: string;

    if (arg.includes("=")) {
      [key, value] = arg.slice(2).split("=", 2) as [string, string];
    } else {
      key = arg.slice(2);
      value = args[++i] ?? "";
    }

    key = toCamelCase(key);

    if (key.includes(".")) {
      const [parentKey, childKey] = key.split(".");
      config[parentKey] = config[parentKey] || {};
      config[parentKey][childKey] = parseValue(value);
    } else {
      config[key] = parseValue(value);
    }
  }

  return config;
}

const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

console.log("\n🚀 Starting build process...\n");

const cliConfig = parseArgs();

const PLATFORM = process.env.BUN_PUBLIC_PLATFORM === "fb" ? "fb" : "web";
const isFacebook = PLATFORM === "fb";
const outdir =
  cliConfig.outdir || path.join(process.cwd(), isFacebook ? "dist-fb" : "dist");
const FB_SDK_TAG =
  '<script src="https://connect.facebook.net/en_US/fbinstant.8.0.js"></script>';

async function injectFacebookSdk(htmlPath: string): Promise<void> {
  const html = await Bun.file(htmlPath).text();
  await Bun.write(htmlPath, html.replace("</head>", `  ${FB_SDK_TAG}\n  </head>`));
}

// FB-build half of the "@platform-impl" compile-time swap. tsconfig aliases it
// to the no-op web.ts stub (default + web bundle); here we re-resolve it to the
// real fb.ts impl, and injectFacebookSdk() adds the CDN <script> so the global
// `FBInstant` exists at runtime. See src/platform/index.ts for the full rationale.
const facebookPlatformPlugin: BunPlugin = {
  name: "facebook-platform-impl",
  setup(build) {
    build.onResolve({ filter: /^@platform-impl$/ }, () => ({
      path: path.resolve(process.cwd(), "src/platform/fb.ts"),
    }));
  },
};

async function copyFacebookConfig(): Promise<void> {
  const src = path.join(process.cwd(), "fbapp-config.json");
  if (existsSync(src)) {
    await copyFile(src, path.join(outdir, "fbapp-config.json"));
    console.log("📄 Copied fbapp-config.json to dist");
  }
}

if (existsSync(outdir)) {
  console.log(`🗑️ Cleaning previous build at ${outdir}`);
  await rm(outdir, { recursive: true, force: true });
}

const start = performance.now();

const entrypoints = [...new Bun.Glob("**.html").scanSync("src")]
  .map((a) => path.resolve("src", a))
  .filter((dir) => !dir.includes("node_modules"));
console.log(
  `📄 Found ${entrypoints.length} HTML ${entrypoints.length === 1 ? "file" : "files"} to process\n`,
);

const result = await Bun.build({
  entrypoints,
  outdir,
  plugins: isFacebook ? [plugin, facebookPlatformPlugin] : [plugin],
  minify: true,
  target: "browser",
  sourcemap: "linked",
  env: "inline",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env.BUN_PUBLIC_PLATFORM": JSON.stringify(PLATFORM),
  },
  ...(isFacebook ? { publicPath: "./" } : {}),
  ...cliConfig,
});

const end = performance.now();

const outputTable = result.outputs.map((output) => ({
  File: path.relative(process.cwd(), output.path),
  Type: output.kind,
  Size: formatFileSize(output.size),
}));

console.table(outputTable);

// Copy robots.txt to dist
const robotsTxtSrc = path.join(process.cwd(), "src", "robots.txt");
const robotsTxtDest = path.join(outdir, "robots.txt");
if (existsSync(robotsTxtSrc)) {
  await copyFile(robotsTxtSrc, robotsTxtDest);
  console.log("📄 Copied robots.txt to dist");
}

if (isFacebook) {
  await injectFacebookSdk(path.join(outdir, "index.html"));
  console.log("📄 Injected Facebook Instant Games SDK into index.html");
  await copyFacebookConfig();
}

const buildTime = (end - start).toFixed(2);

console.log(`\n✅ Build completed in ${buildTime}ms\n`);
