export interface FBPlayer {
  id: string | null;
  name: string | null;
  photo: string | null;
  signature: string | null;
}

export interface Platform {
  initPlatform(): Promise<void>;
  setLoadingProgress(progress: number): void;
  getPlayer(): FBPlayer | null;
}
