import { signInWithCustomToken, type Auth, type UserCredential } from "firebase/auth";

export class FbSessionAuthService {
  constructor(private auth: Auth) {}

  async signIn(playerId: string, signature: string): Promise<UserCredential> {
    const token = await this.fetchToken(playerId, signature);
    return signInWithCustomToken(this.auth, token);
  }

  private async fetchToken(playerId: string, signature: string): Promise<string> {
    const res = await fetch(process.env.BUN_PUBLIC_FB_AUTH_FUNCTION_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, signature }),
    });

    if (!res.ok) {
      throw new Error("FB auth failed");
    }

    const { token } = await res.json();
    return token;
  }
}
