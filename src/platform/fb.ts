import type { Platform, FBPlayer } from "./types";

let cachedPlayer: FBPlayer | null = null;

function setLoadingProgress(progress: number): void {
  FBInstant.setLoadingProgress(progress);
}

async function loadPlayer(): Promise<FBPlayer> {
  try {
    const signed = await FBInstant.player.getSignedPlayerInfoAsync("connections_bg");
    return {
      id: FBInstant.player.getID() || null,
      name: FBInstant.player.getName() || null,
      photo: FBInstant.player.getPhoto() || null,
      signature: signed?.getSignature() || null,
    };
  } catch (err) {
    console.warn("[platform/fb] getSignedPlayerInfoAsync failed", err);
    return { id: null, name: null, photo: null, signature: null };
  }
}

async function initPlatform(): Promise<void> {
  await FBInstant.initializeAsync();
  setLoadingProgress(100);
  await FBInstant.startGameAsync();
  cachedPlayer = await loadPlayer();
}

function getPlayer(): FBPlayer | null {
  return cachedPlayer;
}

export const platformImpl: Platform = { initPlatform, setLoadingProgress, getPlayer };
