import { logger } from "../observability/safeLogger.js";
import { redis } from "../server.js";

export async function initiateCollaborativeSession(sessionId: string, participants: string[]) {
  logger.info("Initiating collaborative session", { sessionId, participants });

  const sessionConfig = {
    sessionId,
    participants,
    features: ["shared_control", "annotations", "voice_chat"],
    createdAt: Date.now(),
    status: "active"
  };

  await redis.set(`session:${sessionId}:collaboration`, JSON.stringify(sessionConfig));
  
  return sessionConfig;
}
