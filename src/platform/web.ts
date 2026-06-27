import type { Platform } from "./types";

export const platformImpl: Platform = {
  async initPlatform() {},
  setLoadingProgress() {},
  getPlayer() {
    return null;
  },
};
