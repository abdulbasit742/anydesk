/**
 * SDK Example: Webhook Management
 */

// Register a webhook
async function registerWebhook(url: string, events: string[]) {
  const res = await fetch(`${API_URL}/webhooks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ url, events }),
  });
  return res.json();
}

// Verify webhook signature
import { createHmac } from "crypto";

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  return signature === `sha256=${expected}`;
}

// Webhook handler example (Express)
import express from "express";
const app = express();

app.post("/webhook/remotedesk", express.raw({ type: "application/json" }), (req, res) => {
  const signature = req.headers["x-webhook-signature"] as string;
  const secret = process.env.WEBHOOK_SECRET!;
  
  if (!verifyWebhookSignature(req.body, signature, secret)) {
    return res.status(401).send("Invalid signature");
  }
  
  const event = JSON.parse(req.body);
  console.log("Received event:", event.type);
  
  switch (event.type) {
    case "session.started":
      // Handle session start
      break;
    case "session.ended":
      // Handle session end
      break;
    case "user.created":
      // Handle new user
      break;
  }
  
  res.status(200).send("OK");
});
