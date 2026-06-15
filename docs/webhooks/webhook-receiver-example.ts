import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.raw({ type: "application/json" }));

const WEBHOOK_SECRET = process.env.REMOTEDESK_WEBHOOK_SECRET!;

app.post("/webhooks/remotedesk", (req, res) => {
  const signature = req.headers["x-webhook-signature"] as string;
  const payload = req.body as string;

  // Verify signature
  const expected = crypto.createHmac("sha256", WEBHOOK_SECRET).update(payload).digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    res.status(401).send("Invalid signature");
    return;
  }

  const event = JSON.parse(payload);

  // Acknowledge quickly
  res.status(200).send("OK");

  // Process async
  processEvent(event).catch(console.error);
});

async function processEvent(event: { type: string; data: Record<string, unknown> }) {
  switch (event.type) {
    case "session.started":
      console.log("Session started:", event.data.session_id);
      break;
    case "billing.payment_succeeded":
      console.log("Payment succeeded:", event.data.invoice_id);
      break;
    default:
      console.log("Unhandled event:", event.type);
  }
}

app.listen(3001, () => console.log("Webhook receiver on port 3001"));
