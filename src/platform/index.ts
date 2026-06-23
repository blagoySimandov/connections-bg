import type { Platform } from "./types";
import { platformImpl } from "@platform-impl";

export function loadPlatform(): Promise<Platform> {
  return Promise.resolve(platformImpl);
}
