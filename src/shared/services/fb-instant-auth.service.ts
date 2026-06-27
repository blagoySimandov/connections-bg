import { signInWithCustomToken, type Auth, type UserCredential } from "firebase/auth";

export interface FbSignInResult {
  cred: UserCredential;
  name: string | null;
  photo: string | null;
}

export class FbSessionAuthService {
  constructor(private auth: Auth) {}

  async signIn(playerId: string, signature: string): Promise<FbSignInResult> {
    const { token, name, photo } = await this.fetchToken(playerId, signature);
    const cred = await signInWithCustomToken(this.auth, token);
    return { cred, name, photo };
  }

  private async fetchToken(
    playerId: string,
    signature: string,
  ): Promise<{ token: string; name: string | null; photo: string | null }> {
    const res = await fetch(process.env.BUN_PUBLIC_FB_AUTH_FUNCTION_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, signature }),
    });

    if (!res.ok) {
      throw new Error("FB auth failed");
    }

    const { token, name, photo } = await res.json();
    return { token, name: name ?? null, photo: photo ?? null };
  }
}
