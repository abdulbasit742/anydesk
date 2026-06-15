/**
 * Webhook Receiver Example (Express)
 */

import express from "express";
import { webhookAuth } from "./webhook-signing-examples";

const app = express();
const WEBHOOK_SECRET = process.env.REMOTEDESK_WEBHOOK_SECRET!;

// Important: Use raw body for signature verification
app.use("/webhooks", express.raw({ type: "application/json" }));

// Verify signature
app.use("/webhooks", webhookAuth(WEBHOOK_SECRET));

// Parse JSON after verification
app.use("/webhooks", express.json());

// Handle events
app.post("/webhooks/remotedesk", async (req, res) => {
  const event = JSON.parse(req.body);
  
  console.log(`Received ${event.type} at ${event.timestamp}`);
  
  switch (event.type) {
    case "session.started": {
      const { session_id, host_id, viewer_id } = event.data;
      await handleSessionStarted(session_id, host_id, viewer_id);
      break;
    }
    case "session.ended": {
      const { session_id, duration } = event.data;
      await handleSessionEnded(session_id, duration);
      break;
    }
    case "user.created": {
      const { user_id, email } = event.data;
      await handleUserCreated(user_id, email);
      break;
    }
    default:
      console.log(`Unhandled event: ${event.type}`);
  }
  
  res.status(200).send("OK");
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Webhook error:", err);
  res.status(500).send("Internal error");
});

app.listen(3000, () => console.log("Webhook receiver on port 3000"));

// Handlers
async function handleSessionStarted(sessionId: string, hostId: string, viewerId: string) {
  console.log(`Session ${sessionId} started between ${hostId} and ${viewerId}`);
}

async function handleSessionEnded(sessionId: string, duration: number) {
  console.log(`Session ${sessionId} ended after ${duration}s`);
}

async function handleUserCreated(userId: string, email: string) {
  console.log(`User ${userId} (${email}) created`);
}
