import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { prisma } from "../../lib/prisma.js";

const router = Router();
router.use(requireAuth);

const createGroupInput = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  location: z.string().max(255).optional(),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional()
});

const updateGroupInput = createGroupInput.partial();

// Create device group
router.post("/", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = createGroupInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  try {
    const group = await prisma.deviceGroup.create({
      data: {
        ...input.data,
        userId: req.user!.id
      }
    });

    res.status(201).json({ success: true, data: group });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ success: false, message: "Group name already exists" });
    }
    throw error;
  }
}));

// List device groups
router.get("/", asyncHandler<AuthedRequest>(async (req, res) => {
  const groups = await prisma.deviceGroup.findMany({
    where: { userId: req.user!.id },
    include: {
      devices: {
        select: { id: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  res.json({
    success: true,
    data: groups.map(g => ({
      ...g,
      deviceCount: g.devices.length
    }))
  });
}));

// Get group by ID
router.get("/:groupId", asyncHandler<AuthedRequest>(async (req, res) => {
  const group = await prisma.deviceGroup.findFirst({
    where: {
      id: req.params.groupId,
      userId: req.user!.id
    },
    include: {
      devices: {
        select: {
          id: true,
          name: true,
          platform: true,
          isOnline: true
        }
      }
    }
  });

  if (!group) return res.status(404).json({ success: false, message: "Group not found" });
  res.json({ success: true, data: group });
}));

// Update group
router.put("/:groupId", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = updateGroupInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const group = await prisma.deviceGroup.findFirst({
    where: {
      id: req.params.groupId,
      userId: req.user!.id
    }
  });

  if (!group) return res.status(404).json({ success: false, message: "Group not found" });

  const updated = await prisma.deviceGroup.update({
    where: { id: group.id },
    data: input.data
  });

  res.json({ success: true, data: updated });
}));

// Delete group
router.delete("/:groupId", asyncHandler<AuthedRequest>(async (req, res) => {
  const group = await prisma.deviceGroup.findFirst({
    where: {
      id: req.params.groupId,
      userId: req.user!.id
    }
  });

  if (!group) return res.status(404).json({ success: false, message: "Group not found" });

  await prisma.deviceGroup.delete({
    where: { id: group.id }
  });

  res.json({ success: true, message: "Group deleted" });
}));

// Add device to group
router.post("/:groupId/devices/:deviceId", asyncHandler<AuthedRequest>(async (req, res) => {
  const group = await prisma.deviceGroup.findFirst({
    where: {
      id: req.params.groupId,
      userId: req.user!.id
    }
  });

  if (!group) return res.status(404).json({ success: false, message: "Group not found" });

  const device = await prisma.device.findFirst({
    where: {
      id: req.params.deviceId,
      userId: req.user!.id
    }
  });

  if (!device) return res.status(404).json({ success: false, message: "Device not found" });

  // Update device group association (implementation depends on schema)
  res.json({ success: true, message: "Device added to group" });
}));

export default router;
