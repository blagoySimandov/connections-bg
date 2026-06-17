import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import { defineSecret, defineString } from "firebase-functions/params";
import * as admin from "firebase-admin";
import * as crypto from "crypto";

setGlobalOptions({ maxInstances: 10 });

admin.initializeApp();

const fbAppSecret = defineSecret("FACEBOOK_APP_SECRET");
const fbAppId = defineString("FACEBOOK_APP_ID");

export const fbAuth = onRequest(
  { secrets: [fbAppSecret] },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

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
    const expectedSig = crypto
      .createHmac("sha256", appSecret)
      .update(Buffer.from(encodedPayload, "base64url"))
      .digest();

    const actualSig = Buffer.from(encodedSig, "base64url");

    if (!crypto.timingSafeEqual(expectedSig, actualSig)) {
      res.status(401).json({ error: "Invalid signature" });
      return;
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString(),
    );
    if (payload.player_id !== playerId) {
      res.status(401).json({ error: "Player ID mismatch" });
      return;
    }

    if (payload.app_id !== fbAppId.value()) {
      res.status(401).json({ error: "App ID mismatch" });
      return;
    }

    const token = await admin.auth().createCustomToken(`fb_${playerId}`);
    res.json({ token });
  },
);
