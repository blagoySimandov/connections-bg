// Force FB mode via env var (for local dev testing)
// Auto-detected at runtime when FBInstant SDK is present (inside FB/Messenger)
export const IS_FACEBOOK_INSTANT_GAMES =
  process.env.BUN_PUBLIC_FACEBOOK_INSTANT_GAMES === "true" ||
  (typeof window !== "undefined" && "FBInstant" in window);
