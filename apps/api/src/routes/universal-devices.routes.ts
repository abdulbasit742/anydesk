import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { prisma } from "../lib/prisma.js";

const router = Router();
router.use(requireAuth);

/**
 * Get all devices for user
 */
router.get(
  "/",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const devices = await prisma.universalDevice.findMany({
      where: { userId: req.user.id },
    });

    res.json({
      success: true,
      data: devices,
    });
  })
);

/**
 * Get devices by type
 */
router.get(
  "/type/:deviceType",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceType } = req.params;

    const devices = await prisma.universalDevice.findMany({
      where: {
        userId: req.user.id,
        deviceType,
      },
    });

    res.json({
      success: true,
      data: devices,
    });
  })
);

/**
 * Get device details
 */
router.get(
  "/:deviceId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId } = req.params;

    const device = await prisma.universalDevice.findUnique({
      where: { deviceId },
    });

    if (!device || device.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: "Device not found" });
    }

    res.json({
      success: true,
      data: device,
    });
  })
);

/**
 * Get device state
 */
router.get(
  "/:deviceId/state",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId } = req.params;

    const device = await prisma.universalDevice.findUnique({
      where: { deviceId },
    });

    if (!device || device.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: "Device not found" });
    }

    res.json({
      success: true,
      data: {
        deviceId,
        status: device.status,
        lastSeen: device.lastSeen,
        metrics: device.metrics,
      },
    });
  })
);

/**
 * Send command to device
 */
router.post(
  "/:deviceId/command",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId } = req.params;
    const { command, params } = req.body;

    if (!command) {
      return res.status(400).json({ success: false, error: "Command required" });
    }

    const device = await prisma.universalDevice.findUnique({
      where: { deviceId },
    });

    if (!device || device.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: "Device not found" });
    }

    // Store command in database
    const deviceCommand = await prisma.deviceCommand.create({
      data: {
        deviceId,
        commandName: command,
        params,
        status: "pending",
      },
    });

    res.json({
      success: true,
      data: deviceCommand,
    });
  })
);

/**
 * Get device statistics
 */
router.get(
  "/stats/overview",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const devices = await prisma.universalDevice.findMany({
      where: { userId: req.user.id },
    });

    const stats = {
      total: devices.length,
      online: devices.filter((d) => d.status === "online").length,
      offline: devices.filter((d) => d.status === "offline").length,
      byType: {} as Record<string, number>,
    };

    for (const device of devices) {
      stats.byType[device.deviceType] = (stats.byType[device.deviceType] || 0) + 1;
    }

    res.json({
      success: true,
      data: stats,
    });
  })
);

/**
 * Create automation rule
 */
router.post(
  "/automations",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { name, description, trigger, conditions, actions, enabled } = req.body;

    const rule = await prisma.automationRule.create({
      data: {
        userId: req.user.id,
        name,
        description,
        trigger,
        conditions,
        actions,
        enabled: enabled !== false,
      },
    });

    res.json({
      success: true,
      data: rule,
    });
  })
);

/**
 * Get automation rules
 */
router.get(
  "/automations",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const rules = await prisma.automationRule.findMany({
      where: { userId: req.user.id },
    });

    res.json({
      success: true,
      data: rules,
    });
  })
);

/**
 * Get notifications
 */
router.get(
  "/notifications",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const unreadOnly = req.query.unreadOnly === "true";

    const where: any = { userId: req.user.id };

    if (unreadOnly) {
      where.read = false;
    }

    const notifications = await prisma.unifiedNotification.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    res.json({
      success: true,
      data: notifications,
    });
  })
);

/**
 * Mark notification as read
 */
router.post(
  "/notifications/:notificationId/read",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { notificationId } = req.params;

    await prisma.unifiedNotification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  })
);

/**
 * Get screen time analytics
 */
router.get(
  "/analytics/screentime",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const screenTimeLogs = await prisma.screenTimeLog.findMany({
      where: { userId: req.user.id },
      orderBy: { date: "desc" },
      take: 30,
    });

    res.json({
      success: true,
      data: screenTimeLogs,
    });
  })
);

/**
 * Get device health overview
 */
router.get(
  "/health/overview",
  asyncHandler<AuthedRequest>(async (req: any, res) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const devices = await prisma.universalDevice.findMany({
      where: { userId },
    });

    const health = {
      devices: devices.map((d: any) => ({
        deviceId: d.deviceId,
        deviceName: d.deviceName,
        battery: (d.metrics as any)?.battery,
        storage: d.metrics?.storage,
        temperature: d.metrics?.temperature,
        status: d.status,
      })),
    };

    res.json({
      success: true,
      data: health,
    });
  })
);

export default router;

