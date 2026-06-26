import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { redis } from "../server.js";

const router = Router();

router.get("/device-health/:deviceId", requireAuth, asyncHandler(async (req: AuthedRequest, res) => {
  const { deviceId } = req.params;

  const latestMetrics = await redis.get(`device:${deviceId}:latestMetrics`);
  const predictions = await redis.lrange(`device:${deviceId}:predictions`, 0, -1);

  // Mock health score calculation based on latest metrics
  let healthScore = 100;
  if (latestMetrics) {
    const metrics = JSON.parse(latestMetrics);
    if (metrics.cpu > 70) healthScore -= 20;
    if (metrics.memory.used / metrics.memory.total > 0.8) healthScore -= 15;
    if (metrics.disk.free < 20) healthScore -= 10;
  }

  res.json({
    success: true,
    deviceId,
    healthScore: Math.max(0, healthScore),
    latestMetrics: latestMetrics ? JSON.parse(latestMetrics) : null,
    predictions: predictions.map(p => JSON.parse(p)),
  });
}));

export default router;
