import { signInWithCustomToken, type Auth, type UserCredential } from "firebase/auth";

export class FBInstantAuthService {
  constructor(private auth: Auth) {}

  async signIn(): Promise<UserCredential> {
    const signedInfo = await FBInstant.player.getSignedPlayerInfoAsync("connections_bg");
    const playerId = FBInstant.player.getID();

    const res = await fetch(process.env.BUN_PUBLIC_FB_AUTH_FUNCTION_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, signature: signedInfo.getSignature() }),
    });

    if (!res.ok) {
      throw new Error("FB auth failed");
    }

    const { token } = await res.json();
    return signInWithCustomToken(this.auth, token);
  }

  getPlayerName(): string | null {
    return FBInstant.player.getName();
  }

  getPlayerPhoto(): string | null {
    return FBInstant.player.getPhoto();
  }
}
