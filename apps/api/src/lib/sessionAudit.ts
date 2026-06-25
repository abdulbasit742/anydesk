import { logger } from "../observability/safeLogger.js";
import { redis } from "../server.js";

export async function logSessionEvent(sessionId: string, event: any) {
  const auditEvent = {
    ...event,
    timestamp: Date.now(),
  };

  await redis.lpush(`session:${sessionId}:audit`, JSON.stringify(auditEvent));
  
  // Mock AI Forensic Summary trigger
  if (Math.random() > 0.9) {
    await generateAISummary(sessionId);
  }
}

async function generateAISummary(sessionId: string) {
  const summary = "AI Audit Summary: Session involved sensitive file access and administrative command execution. No anomalies detected.";
  await redis.set(`session:${sessionId}:aiSummary`, summary);
  logger.info("AI forensic audit summary generated", { sessionId });
}
