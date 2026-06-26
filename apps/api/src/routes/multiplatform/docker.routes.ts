import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { dockerManager } from "../../services/dockerManager.js";
import { prisma } from "../../lib/prisma.js";

const router = Router();
router.use(requireAuth);

const containerActionInput = z.object({
  action: z.enum(["start", "stop", "restart", "remove"]),
  timeout: z.number().int().min(1).max(300).optional()
});

// List Docker containers on a device
router.get("/devices/:deviceId/containers", asyncHandler<AuthedRequest>(async (req, res) => {
  try {
    const device = await prisma.device.findFirst({
      where: {
        id: req.params.deviceId,
        userId: req.user!.id
      }
    });

    if (!device) return res.status(404).json({ success: false, message: "Device not found" });

    // Initialize Docker client for device (in production, would connect to device agent)
    // For now, return cached container data
    const containers = await prisma.dockerContainer.findMany({
      where: { deviceId: req.params.deviceId },
      orderBy: { lastUpdated: "desc" }
    });

    res.json({
      success: true,
      data: containers
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// Get container details
router.get("/devices/:deviceId/containers/:containerId", asyncHandler<AuthedRequest>(async (req, res) => {
  try {
    const device = await prisma.device.findFirst({
      where: {
        id: req.params.deviceId,
        userId: req.user!.id
      }
    });

    if (!device) return res.status(404).json({ success: false, message: "Device not found" });

    const container = await prisma.dockerContainer.findUnique({
      where: {
        deviceId_containerId: {
          deviceId: req.params.deviceId,
          containerId: req.params.containerId
        }
      }
    });

    if (!container) return res.status(404).json({ success: false, message: "Container not found" });

    res.json({ success: true, data: container });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// Get container stats
router.get("/devices/:deviceId/containers/:containerId/stats", asyncHandler<AuthedRequest>(async (req, res) => {
  try {
    const device = await prisma.device.findFirst({
      where: {
        id: req.params.deviceId,
        userId: req.user!.id
      }
    });

    if (!device) return res.status(404).json({ success: false, message: "Device not found" });

    // In production, would fetch live stats from Docker API via device agent
    const stats = {
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 1024,
      networkIO: {
        rx_bytes: Math.random() * 1000000,
        tx_bytes: Math.random() * 1000000
      }
    };

    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// Get container logs
router.get("/devices/:deviceId/containers/:containerId/logs", asyncHandler<AuthedRequest>(async (req, res) => {
  try {
    const device = await prisma.device.findFirst({
      where: {
        id: req.params.deviceId,
        userId: req.user!.id
      }
    });

    if (!device) return res.status(404).json({ success: false, message: "Device not found" });

    const tail = parseInt(req.query.tail as string) || 100;

    // In production, would fetch logs from Docker API via device agent
    const logs = "Container logs would be streamed here...";

    res.json({
      success: true,
      data: {
        logs,
        tail,
        containerId: req.params.containerId
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// Execute container action (start, stop, restart, remove)
router.post("/devices/:deviceId/containers/:containerId/action", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = containerActionInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  try {
    const device = await prisma.device.findFirst({
      where: {
        id: req.params.deviceId,
        userId: req.user!.id
      }
    });

    if (!device) return res.status(404).json({ success: false, message: "Device not found" });

    const container = await prisma.dockerContainer.findUnique({
      where: {
        deviceId_containerId: {
          deviceId: req.params.deviceId,
          containerId: req.params.containerId
        }
      }
    });

    if (!container) return res.status(404).json({ success: false, message: "Container not found" });

    // In production, would send command to device agent
    const action = input.data.action;
    const timeout = input.data.timeout || 10;

    // Update container status based on action
    let newStatus = container.status;
    if (action === "start") newStatus = "running";
    else if (action === "stop" || action === "remove") newStatus = "exited";
    else if (action === "restart") newStatus = "running";

    await prisma.dockerContainer.update({
      where: {
        deviceId_containerId: {
          deviceId: req.params.deviceId,
          containerId: req.params.containerId
        }
      },
      data: { status: newStatus }
    });

    res.json({
      success: true,
      message: `Container ${action} initiated`,
      data: {
        action,
        containerId: req.params.containerId,
        newStatus
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// Refresh container list
router.post("/devices/:deviceId/containers/refresh", asyncHandler<AuthedRequest>(async (req, res) => {
  try {
    const device = await prisma.device.findFirst({
      where: {
        id: req.params.deviceId,
        userId: req.user!.id
      }
    });

    if (!device) return res.status(404).json({ success: false, message: "Device not found" });

    // In production, would trigger device agent to refresh container list
    res.json({
      success: true,
      message: "Container list refresh initiated"
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

export default router;
