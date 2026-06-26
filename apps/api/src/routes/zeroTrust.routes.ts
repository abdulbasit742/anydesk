import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ZeroTrustEngine } from "../lib/zeroTrustEngine.js";

const router = Router();

// Device Fingerprinting Routes
router.post("/fingerprint/register", requireAuth, asyncHandler(async (req: any, res) => {
  const schema = z.object({
    deviceId: z.string(),
    hardwareId: z.string(),
    tpmHash: z.string().optional(),
    secureBootEnabled: z.boolean(),
    osVersion: z.string(),
    macAddress: z.string().optional()
  });

  const data = schema.parse(req.body);

  const fingerprint = await prisma.deviceFingerprint.upsert({
    where: { deviceId: data.deviceId },
    update: {
      hardwareId: data.hardwareId,
      tpmHash: data.tpmHash,
      secureBootEnabled: data.secureBootEnabled,
      osVersion: data.osVersion,
      macAddress: data.macAddress
    },
    create: {
      ...data,
      approved: false // Requires admin approval
    }
  });

  await ZeroTrustEngine.logSecurityEvent({
    userId: req.user!.id,
    deviceId: data.deviceId,
    action: "DEVICE_FINGERPRINT_REGISTERED",
    ipAddress: req.ip
  });

  res.json({ success: true, data: fingerprint });
}));

router.post("/fingerprint/:id/approve", requireAuth, asyncHandler(async (req: any, res) => {
  const { id } = req.params;

  const fingerprint = await prisma.deviceFingerprint.update({
    where: { id },
    data: {
      approved: true,
      approvedByUserId: req.user!.id,
      approvedAt: new Date()
    }
  });

  await ZeroTrustEngine.logSecurityEvent({
    userId: req.user!.id,
    deviceId: fingerprint.deviceId,
    action: "DEVICE_APPROVED",
    ipAddress: req.ip
  });

  res.json({ success: true, data: fingerprint });
}));

router.get("/fingerprints", requireAuth, asyncHandler(async (req: any, res) => {
  const fingerprints = await prisma.deviceFingerprint.findMany({
    include: { device: true, approvedBy: { select: { email: true } } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ success: true, data: fingerprints });
}));

// Geo-Fence Policies
router.get("/geo-fence", requireAuth, asyncHandler(async (req: any, res) => {
  const policies = await prisma.geoFencePolicy.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ success: true, data: policies });
}));

router.post("/geo-fence", requireAuth, asyncHandler(async (req: any, res) => {
  const schema = z.object({
    name: z.string(),
    action: z.enum(["block", "alert"]),
    countries: z.array(z.string()),
    enabled: z.boolean().optional()
  });
  
  const data = schema.parse(req.body);
  const policy = await prisma.geoFencePolicy.create({ data });
  
  await ZeroTrustEngine.logSecurityEvent({
    userId: req.user!.id,
    action: "GEO_FENCE_POLICY_CREATED",
    ipAddress: req.ip,
    details: { policyId: policy.id }
  });

  res.json({ success: true, data: policy });
}));

// Threat Alerts
router.get("/threats", requireAuth, asyncHandler(async (req: any, res) => {
  const threats = await prisma.threatAlert.findMany({
    include: { device: true, user: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100
  });
  res.json({ success: true, data: threats });
}));

router.post("/threats/:id/resolve", requireAuth, asyncHandler(async (req: any, res) => {
  const { id } = req.params;
  const threat = await prisma.threatAlert.update({
    where: { id },
    data: { resolved: true, resolvedAt: new Date() }
  });

  await ZeroTrustEngine.logSecurityEvent({
    userId: req.user!.id,
    action: "THREAT_RESOLVED",
    ipAddress: req.ip,
    details: { threatId: id }
  });

  res.json({ success: true, data: threat });
}));

// Audit Logs
router.get("/audit-logs", requireAuth, asyncHandler(async (req: any, res) => {
  const logs = await prisma.securityAuditLog.findMany({
    include: { user: { select: { email: true } }, device: { select: { name: true } } },
    orderBy: { timestamp: "desc" },
    take: 200
  });
  res.json({ success: true, data: logs });
}));

// Zero Trust Engine Verification Endpoint (Called by clients before connecting)
router.post("/verify-access", requireAuth, asyncHandler(async (req: any, res) => {
  const schema = z.object({
    deviceId: z.string(),
    countryCode: z.string().optional()
  });

  const { deviceId, countryCode } = schema.parse(req.body);

  // 1. Geo-Fence Check
  if (countryCode) {
    const geoCheck = await ZeroTrustEngine.checkGeoFence(countryCode);
    if (!geoCheck.allowed) {
      await ZeroTrustEngine.reportThreat("geo_fence_violation", "high", geoCheck.reason!, {
        userId: req.user!.id, deviceId, ipAddress: req.ip, location: countryCode, action: "CONNECT"
      });
      return res.status(403).json({ success: false, message: geoCheck.reason });
    }
  }

  // 2. Zero-Trust Policy Check
  const accessCheck = await ZeroTrustEngine.evaluateAccess({
    userId: req.user!.id,
    deviceId,
    ipAddress: req.ip,
    action: "CONNECT"
  });

  if (!accessCheck.allowed) {
    await ZeroTrustEngine.logSecurityEvent({
      userId: req.user!.id, deviceId, ipAddress: req.ip, action: "ACCESS_DENIED", details: { reason: accessCheck.reason }
    }, accessCheck.riskScore);
    return res.status(403).json({ success: false, message: accessCheck.reason });
  }

  // Log successful verification
  await ZeroTrustEngine.logSecurityEvent({
    userId: req.user!.id, deviceId, ipAddress: req.ip, action: "ACCESS_GRANTED"
  }, accessCheck.riskScore);

  res.json({ success: true, data: { riskScore: accessCheck.riskScore } });
}));

export default router;
