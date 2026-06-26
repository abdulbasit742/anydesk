import { logger } from "../observability/safeLogger.js";
import { redis } from "../server.js";

export async function optimizeNetwork(deviceId: string, networkMetrics: any) {
  logger.info("Analyzing network for optimization", { deviceId });

  const { latency, jitter, bandwidth } = networkMetrics;
  let optimizationLevel = "standard";
  let videoQuality = "high";
  let compression = "medium";

  if (latency > 150 || jitter > 30) {
    optimizationLevel = "aggressive";
    videoQuality = "low";
    compression = "high";
  } else if (latency > 80) {
    optimizationLevel = "balanced";
    videoQuality = "medium";
    compression = "medium";
  }

  const config = {
    deviceId,
    timestamp: Date.now(),
    optimizationLevel,
    videoQuality,
    compression,
    status: "applied"
  };

  await redis.set(`device:${deviceId}:networkConfig`, JSON.stringify(config));
  logger.info("Network optimization applied", { deviceId, optimizationLevel, videoQuality });
  
  return config;
}
