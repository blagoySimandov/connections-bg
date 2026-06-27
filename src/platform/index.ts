import type { Platform } from "./types";
// The "@platform-impl" alias is a compile-time swap, not a real module.
//
// We only want to load the Facebook Instant Games SDK in the Facebook build.
// Normally a conditional import would do, but the SDK isn't on npm (it's a
// CDN-only global script), and TypeScript won't let us conditionally import a
// module that doesn't exist as a package.
//
// So we point the alias at two different files:
//   - tsconfig.json maps "@platform-impl" -> ./platform/web.ts (the default).
//     web.ts is a no-op stub that satisfies the Platform interface, so the
//     type checker and the web bundle stay happy with zero FB code.
//   - In the FB build, build.ts re-resolves "@platform-impl" -> ./platform/fb.ts
//     (the real impl that uses the global `FBInstant`) and injects the CDN
//     <script> tag into index.html so that global actually exists at runtime.
//
// Net effect: web ships zero Facebook code, FB ships the real SDK, and TS is
// none the wiser. See `facebookPlatformPlugin` + `injectFacebookSdk` in build.ts.
import { platformImpl } from "@platform-impl";

export function loadPlatform(): Promise<Platform> {
  return Promise.resolve(platformImpl);
}
