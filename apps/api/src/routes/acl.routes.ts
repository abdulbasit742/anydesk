import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { prisma } from "../lib/prisma.js";
import { z } from "zod";

const router = Router();
router.use(requireAuth);

const aclEntryInput = z.object({
  remoteDeskId: z.string().min(1),
  action: z.enum(["allow", "block"]),
  label: z.string().optional(),
});

/**
 * GET /api/acl
 * List all ACL entries for the current user
 */
router.get("/", asyncHandler<AuthedRequest>(async (req, res) => {
  const userId = req.user!.id;
  const entries = await prisma.accessControlEntry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: entries });
}));

/**
 * POST /api/acl
 * Add a new ACL entry (allow or block a device)
 */
router.post("/", asyncHandler<AuthedRequest>(async (req, res) => {
  const userId = req.user!.id;
  const parsed = aclEntryInput.parse(req.body);

  const entry = await prisma.accessControlEntry.upsert({
    where: {
      userId_remoteDeskId: { userId, remoteDeskId: parsed.remoteDeskId },
    },
    update: { action: parsed.action, label: parsed.label },
    create: {
      userId,
      remoteDeskId: parsed.remoteDeskId,
      action: parsed.action,
      label: parsed.label,
    },
  });

  res.status(201).json({ success: true, data: entry });
}));

/**
 * DELETE /api/acl/:id
 * Remove an ACL entry
 */
router.delete("/:id", asyncHandler<AuthedRequest>(async (req, res) => {
  const userId = req.user!.id;
  const { id } = req.params;

  await prisma.accessControlEntry.deleteMany({
    where: { id, userId },
  });

  res.json({ success: true });
}));

/**
 * GET /api/acl/check/:remoteDeskId
 * Check if a specific device is allowed to connect
 */
router.get("/check/:remoteDeskId", asyncHandler<AuthedRequest>(async (req, res) => {
  const userId = req.user!.id;
  const { remoteDeskId } = req.params;

  const entry = await prisma.accessControlEntry.findUnique({
    where: { userId_remoteDeskId: { userId, remoteDeskId } },
  });

  if (!entry) {
    return res.json({ success: true, data: { allowed: true, reason: "no-rule" } });
  }

  res.json({
    success: true,
    data: {
      allowed: entry.action === "allow",
      reason: entry.action === "allow" ? "whitelisted" : "blacklisted",
    },
  });
}));

export default router;
