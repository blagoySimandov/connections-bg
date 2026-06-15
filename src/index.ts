import { serve } from "bun";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import index from "./index.html";

const isDevelopment = process.env.NODE_ENV !== "production";

const adminApp = initializeApp({
  credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)),
});
const adminAuth = getAuth(adminApp);

async function verifyFBSignature(signature: string, appSecret: string): Promise<{ playerId: string } | null> {
  const [encodedSig, encodedPayload] = signature.split(".");
  if (!encodedSig || !encodedPayload) return null;

  const expectedSig = new Uint8Array(
    await crypto.subtle.sign(
      "HMAC",
      await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(appSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      ),
      Buffer.from(encodedPayload, "base64url")
    )
  );

  const actualSig = Buffer.from(encodedSig, "base64url");

  if (!crypto.timingSafeEqual(expectedSig, actualSig)) return null;

  const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString());
  return { playerId: payload.player_id };
}

const server = serve({
  routes: {
    "/api/fb-auth": {
      POST: async (req) => {
        const appSecret = process.env.FACEBOOK_APP_SECRET;
        if (!appSecret) {
          return Response.json({ error: "FB app secret not configured" }, { status: 500 });
        }

        const { playerId, signature } = await req.json();

        const verified = await verifyFBSignature(signature, appSecret);
        if (!verified || verified.playerId !== playerId) {
          return Response.json({ error: "Invalid signature" }, { status: 401 });
        }

        const token = await adminAuth.createCustomToken(`fb_${playerId}`);
        return Response.json({ token });
      },
    },
    "/*": index,
  },

  ...(isDevelopment && {
    development: {
      hmr: true,
      console: true,
    },
  }),
});

console.log(`Server running at ${server.url}`);
