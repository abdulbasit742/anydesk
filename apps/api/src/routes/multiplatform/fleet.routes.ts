import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { fleetOperationsManager } from "../../services/fleetOperations.js";
import { hardwareInventoryManager } from "../../services/hardwareInventory.js";
import { prisma } from "../../lib/prisma.js";

const router = Router();
router.use(requireAuth);

const createOperationInput = z.object({
  operationType: z.enum([
    "restart",
    "shutdown",
    "update",
    "reboot",
    "collect_diagnostics",
    "refresh_policy",
    "execute_script",
    "deploy_image"
  ]),
  targetDeviceIds: z.array(z.string().uuid()).optional(),
  targetGroups: z.array(z.string().uuid()).optional(),
  targetTags: z.array(z.string()).optional(),
  parameters: z.record(z.unknown()).optional()
});

// Create fleet operation (bulk action)
router.post("/operations", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = createOperationInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  try {
    const operationId = await fleetOperationsManager.createOperation(req.user!.id, {
      operationType: input.data.operationType,
      targetDeviceIds: input.data.targetDeviceIds,
      targetGroups: input.data.targetGroups,
      targetTags: input.data.targetTags,
      parameters: input.data.parameters
    });

    res.status(201).json({
      success: true,
      data: {
        operationId,
        status: "pending"
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}));

// Get operation status
router.get("/operations/:operationId", asyncHandler<AuthedRequest>(async (req, res) => {
  try {
    const operation = await fleetOperationsManager.getOperation(req.params.operationId);

    if (!operation) return res.status(404).json({ success: false, message: "Operation not found" });

    if (operation.userId !== req.user!.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.json({ success: true, data: operation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// List fleet operations
router.get("/operations", asyncHandler<AuthedRequest>(async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const operations = await fleetOperationsManager.listOperations(req.user!.id, limit);

    res.json({
      success: true,
      data: operations
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// Cancel operation
router.post("/operations/:operationId/cancel", asyncHandler<AuthedRequest>(async (req, res) => {
  try {
    const operation = await fleetOperationsManager.getOperation(req.params.operationId);

    if (!operation) return res.status(404).json({ success: false, message: "Operation not found" });

    if (operation.userId !== req.user!.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await fleetOperationsManager.cancelOperation(req.params.operationId);

    res.json({ success: true, message: "Operation canceled" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// Get hardware inventory for all devices
router.get("/inventory", asyncHandler<AuthedRequest>(async (req, res) => {
  try {
    const devices = await prisma.device.findMany({
      where: { userId: req.user!.id },
      include: {
        hardwareInventory: true
      }
    });

    const inventory = devices.map(device => ({
      deviceId: device.id,
      deviceName: device.name,
      platform: device.platform,
      isOnline: device.isOnline,
      hardware: device.hardwareInventory
    }));

    res.json({
      success: true,
      data: inventory
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// Refresh hardware inventory for a device
router.post("/devices/:deviceId/inventory/refresh", asyncHandler<AuthedRequest>(async (req, res) => {
  try {
    const device = await prisma.device.findFirst({
      where: {
        id: req.params.deviceId,
        userId: req.user!.id
      }
    });

    if (!device) return res.status(404).json({ success: false, message: "Device not found" });

    // In production, would trigger device agent to collect hardware info
    // For now, simulate the process
    const hardwareInfo = await hardwareInventoryManager.detectHardware(req.params.deviceId);

    res.json({
      success: true,
      message: "Hardware inventory refresh initiated",
      data: hardwareInfo
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// Get device metrics
router.get("/devices/:deviceId/metrics", asyncHandler<AuthedRequest>(async (req, res) => {
  try {
    const device = await prisma.device.findFirst({
      where: {
        id: req.params.deviceId,
        userId: req.user!.id
      }
    });

    if (!device) return res.status(404).json({ success: false, message: "Device not found" });

    const metrics = await prisma.deviceMetrics.findMany({
      where: { deviceId: req.params.deviceId },
      orderBy: { timestamp: "desc" },
      take: 100
    });

    res.json({
      success: true,
      data: metrics
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// Export fleet inventory as CSV
router.get("/inventory/export", asyncHandler<AuthedRequest>(async (req, res) => {
  try {
    const devices = await prisma.device.findMany({
      where: { userId: req.user!.id },
      include: {
        hardwareInventory: true
      }
    });

    // Generate CSV
    let csv = "Device ID,Device Name,Platform,Online Status,CPU Model,CPU Cores,RAM (GB),Disk Type,Disk Capacity (GB),OS Version\n";

    for (const device of devices) {
      const hw = device.hardwareInventory;
      csv += `"${device.id}","${device.name}","${device.platform}","${device.isOnline ? "Online" : "Offline"}","${hw?.cpuModel || "N/A"}","${hw?.cpuCores || "N/A"}","${hw?.ramGb || "N/A"}","${hw?.diskType || "N/A"}","${hw?.diskCapacityGb || "N/A"}","${hw?.osVersion || "N/A"}"\n`;
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="fleet-inventory.csv"');
    res.send(csv);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

export default router;
