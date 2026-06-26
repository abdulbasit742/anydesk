import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getSwarmManager } from "../agents/AgentSwarmManager.js";
import { prisma } from "../lib/prisma.js";

const router = Router();
router.use(requireAuth);

/**
 * Get swarm status
 */
router.get(
  "/status",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const swarmManager = getSwarmManager();

    if (!swarmManager) {
      return res.status(503).json({ success: false, error: "Agent swarm not initialized" });
    }

    const status = await swarmManager.getStatus();

    res.json({
      success: true,
      data: status,
    });
  })
);

/**
 * Get incidents
 */
router.get(
  "/incidents",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const status = req.query.status as string;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const incidents = await prisma.incident.findMany({
      where,
      include: {
        device: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    res.json({
      success: true,
      data: incidents,
    });
  })
);

/**
 * Get incident details
 */
router.get(
  "/incidents/:incidentId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { incidentId } = req.params;

    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
      include: {
        device: true,
      },
    });

    if (!incident) {
      return res.status(404).json({ success: false, error: "Incident not found" });
    }

    res.json({
      success: true,
      data: incident,
    });
  })
);

/**
 * Report an issue
 */
router.post(
  "/report-issue",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, issueType, details, priority } = req.body;

    if (!deviceId || !issueType) {
      return res.status(400).json({
        success: false,
        error: "Device ID and issue type required",
      });
    }

    const swarmManager = getSwarmManager();

    if (!swarmManager) {
      return res.status(503).json({ success: false, error: "Agent swarm not initialized" });
    }

    await swarmManager.reportIssue(deviceId, issueType, details, priority || "MEDIUM");

    res.json({
      success: true,
      message: "Issue reported to agent swarm",
    });
  })
);

/**
 * Get agent action history
 */
router.get(
  "/agents/:agentType/actions",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { agentType } = req.params;
    const limit = parseInt(req.query.limit as string) || 100;

    const swarmManager = getSwarmManager();

    if (!swarmManager) {
      return res.status(503).json({ success: false, error: "Agent swarm not initialized" });
    }

    const history = swarmManager.getAgentActionHistory(agentType, limit);

    res.json({
      success: true,
      data: history,
    });
  })
);

/**
 * Get message history
 */
router.get(
  "/messages",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const swarmManager = getSwarmManager();

    if (!swarmManager) {
      return res.status(503).json({ success: false, error: "Agent swarm not initialized" });
    }

    const sender = req.query.sender as string;
    const type = req.query.type as string;
    const limit = parseInt(req.query.limit as string) || 50;

    const history = swarmManager.getMessageHistory({
      sender,
      type,
      limit,
    });

    res.json({
      success: true,
      data: history,
    });
  })
);

/**
 * Get security incidents
 */
router.get(
  "/security-incidents",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 50;

    const incidents = await prisma.securityIncident.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    res.json({
      success: true,
      data: incidents,
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

    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
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

    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  })
);

export default router;
