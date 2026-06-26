import { logger } from "../observability/safeLogger.js";
import { redis } from "../server.js";

export async function evaluateZeroTrustAccess(deviceId: string, userId: string, context: any) {
  logger.info("Evaluating Zero-Trust access", { deviceId, userId });

  const { location, time, deviceHealth } = context;
  let accessGranted = true;
  let reason = "Context-aware access granted";

  // Mock Zero-Trust rules
  if (deviceHealth < 50) {
    accessGranted = false;
    reason = "Access denied: Device health score too low";
  } else if (location === "unknown" && time > 22) {
    accessGranted = false;
    reason = "Access denied: Suspicious login time and location";
  }

  const result = {
    deviceId,
    userId,
    timestamp: Date.now(),
    accessGranted,
    reason,
    policy: "Dynamic Context-Aware Policy"
  };

  await redis.set(`access:${userId}:${deviceId}`, JSON.stringify(result));
  logger.info("Zero-Trust evaluation complete", { userId, accessGranted, reason });
  
  return result;
}
