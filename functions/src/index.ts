import { onRequest } from "firebase-functions/https";
import { defineSecret, defineString } from "firebase-functions/params";
import * as admin from "firebase-admin";
import * as crypto from "crypto";

admin.initializeApp();

const fbAppSecret = defineSecret("FACEBOOK_APP_SECRET");
const fbAppId = defineString("FACEBOOK_APP_ID");

export const fbAuth = onRequest({ secrets: [fbAppSecret] }, async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  console.info("[fbAuth] request", {
    hasBody: Boolean(req.body),
    keys: req.body ? Object.keys(req.body) : [],
  });

  const { playerId, signature } = req.body as {
    playerId: string;
    signature: string;
  };

  if (!playerId || !signature) {
    res.status(400).json({ error: "Missing playerId or signature" });
    return;
  }

  const [encodedSig, encodedPayload] = signature.split(".");
  if (!encodedSig || !encodedPayload) {
    res.status(401).json({ error: "Invalid signature format" });
    return;
  }

  const appSecret = fbAppSecret.value();
  // Facebook signs the base64url-encoded payload STRING, not its decoded bytes.
  const expectedSig = crypto.createHmac("sha256", appSecret).update(encodedPayload).digest();

  const actualSig = Buffer.from(encodedSig, "base64url");

  if (
    expectedSig.length !== actualSig.length ||
    !crypto.timingSafeEqual(expectedSig, actualSig)
  ) {
    console.warn("[fbAuth] reject: invalid signature");
    res.status(401).json({ error: "Invalid signature" });
    return;
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString());
  if (payload.player_id !== playerId) {
    console.warn("[fbAuth] reject: player id mismatch", { payloadId: payload.player_id, playerId });
    res.status(401).json({ error: "Player ID mismatch" });
    return;
  }
  // No app_id in the Instant Games signed payload; the HMAC already proves it's
  // signed with our app secret, so app-scoping is covered.

  const token = await admin.auth().createCustomToken(`fb_${playerId}`);
  const { name, photo } = await fetchProfile(playerId, fbAppId.value(), appSecret);
  console.info("[fbAuth] success", { playerId, hasName: Boolean(name), hasPhoto: Boolean(photo) });
  res.json({ token, name, photo });
});

async function fetchProfile(
  playerId: string,
  appId: string,
  appSecret: string,
): Promise<{ name: string | null; photo: string | null }> {
  try {
    const appToken = `${appId}|${appSecret}`;
    const url =
      `https://graph.facebook.com/v23.0/${playerId}` +
      `?fields=name,picture.type(large)&access_token=${appToken}`;
    const res = await fetch(url);
    if (!res.ok) return { name: null, photo: null };
    const body = (await res.json()) as {
      name?: string;
      picture?: { data?: { url?: string } };
    };
    return { name: body.name ?? null, photo: body.picture?.data?.url ?? null };
  } catch {
    return { name: null, photo: null };
  }
}
