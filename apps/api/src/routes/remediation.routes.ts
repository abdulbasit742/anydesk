import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { redis } from "../server.js";

const router = Router();

router.get("/device-remediations/:deviceId", requireAuth, asyncHandler(async (req: AuthedRequest, res) => {
  const { deviceId } = req.params;
  const remediations = await redis.lrange(`device:${deviceId}:remediations`, 0, -1);

  res.json({
    success: true,
    deviceId,
    remediations: remediations.map(r => JSON.parse(r)),
  });
}));

router.post("/approve-remediation", requireAuth, asyncHandler(async (req: AuthedRequest, res) => {
  const { deviceId, remediationId } = req.body;
  // Logic to mark remediation as approved and notify the device agent
  res.json({ success: true, message: "Remediation approved and scheduled" });
}));

export default router;
