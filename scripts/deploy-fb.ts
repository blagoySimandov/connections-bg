#!/usr/bin/env bun
import { $ } from "bun";
import { rm } from "fs/promises";
import path from "path";

const GRAPH_VERSION = process.env.FB_GRAPH_VERSION || "v23.0";
const GRAPH = `https://graph.facebook.com/${GRAPH_VERSION}`;

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
Facebook Instant Games deploy

Usage: bun run deploy:fb [options]

Options:
  --skip-build     Reuse existing dist/ instead of rebuilding
  --comment <txt>  Build comment shown in the FB dashboard
  --help, -h       Show this message

Required env (server-side only, never BUN_PUBLIC_):
  FB_APP_ID        Facebook app id
  FB_APP_SECRET    Facebook app secret
`);
  process.exit(0);
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i === -1 ? undefined : process.argv[i + 1];
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env: ${name}`);
    process.exit(1);
  }
  return value;
}

async function buildBundle(): Promise<void> {
  if (process.argv.includes("--skip-build")) {
    console.log("Skipping build, reusing dist-fb/");
    return;
  }
  console.log("Building fb target...");
  await $`bun run build:fb`;
}

async function zipBundle(zipPath: string): Promise<void> {
  await rm(zipPath, { force: true });
  console.log(`Zipping dist-fb/ -> ${path.basename(zipPath)}`);
  await $`zip -r -q ${zipPath} .`.cwd("dist-fb");
}

async function fetchAppToken(appId: string, appSecret: string): Promise<string> {
  const url = `${GRAPH}/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&grant_type=client_credentials`;
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok) throw new Error(`Token request failed: ${JSON.stringify(body)}`);
  return body.access_token;
}

async function uploadBundle(appId: string, token: string, zipPath: string, comment: string): Promise<unknown> {
  const form = new FormData();
  form.append("access_token", token);
  form.append("type", "BUNDLE");
  form.append("comment", comment);
  form.append("asset", Bun.file(zipPath, { type: "application/octet-stream" }), "bundle.zip");
  console.log("Uploading bundle to Facebook...");
  const res = await fetch(`${GRAPH}/${appId}/assets`, { method: "POST", body: form });
  const body = await res.json();
  if (!res.ok) throw new Error(`Upload failed: ${JSON.stringify(body)}`);
  return body;
}

const appId = requireEnv("FB_APP_ID");
const appSecret = requireEnv("FB_APP_SECRET");
const comment = arg("--comment") || `deploy ${new Date().toISOString()}`;
const zipPath = path.resolve(process.cwd(), "fb-bundle.zip");

await buildBundle();
await zipBundle(zipPath);
const token = await fetchAppToken(appId, appSecret);
const result = await uploadBundle(appId, token, zipPath, comment);

console.log("\nUploaded:", JSON.stringify(result));
console.log(
  `\nManage hosting: https://developers.facebook.com/apps/${appId}/use_cases/customize/hosting/`,
);
console.log(`Play game: https://fb.gg/play/${appId}`);
