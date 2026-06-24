import { Router } from "express";
import { z } from "zod";
import {
  classifyPersistedMigrationRisk,
  deriveEscalationTarget,
  deriveReleaseCandidateStatus,
  ensureDefaultLaunchChecks,
  summarizePersistedLaunchChecks
} from "../lib/launchOperations.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();
router.use(requireAuth);

const launchCheckPatch = z.object({
  area: z.enum(["api", "web", "desktop", "infra", "security", "support", "billing"]).optional(),
  label: z.string().min(2).max(180).optional(),
  status: z.enum(["pass", "warn", "fail", "not_applicable"]).optional(),
  required: z.boolean().optional(),
  notes: z.string().max(1500).optional()
});

const releaseCandidateInput = z.object({
  version: z.string().min(2).max(80),
  gitSha: z.string().min(7).max(80),
  signedDesktopBuild: z.boolean().default(false),
  migrationsReviewed: z.boolean().default(false),
  smokeTestsPassed: z.boolean().default(false),
  notes: z.string().max(1500).optional()
});

const releaseCandidatePatch = releaseCandidateInput.partial().extend({
  status: z.enum(["draft", "blocked", "promotable", "promoted", "rejected"]).optional()
});

const rolloutApprovalInput = z.object({
  releaseCandidateId: z.string().uuid().optional(),
  area: z.enum(["security", "desktop", "billing", "infra", "support"]),
  decision: z.enum(["pending", "approved", "rejected"]).default("pending"),
  reason: z.string().max(1500).optional()
});

const rolloutApprovalPatch = z.object({
  decision: z.enum(["pending", "approved", "rejected"]),
  reason: z.string().max(1500).optional()
});

const migrationCheckInput = z.object({
  releaseCandidateId: z.string().uuid().optional(),
  name: z.string().min(2).max(160),
  touchesAuth: z.boolean().default(false),
  touchesBilling: z.boolean().default(false),
  destructive: z.boolean().default(false),
  backfillRows: z.number().int().min(0).default(0),
  reviewed: z.boolean().default(false),
  status: z.enum(["pending", "approved", "blocked", "applied"]).default("pending"),
  notes: z.string().max(1500).optional()
});

const migrationCheckPatch = migrationCheckInput.partial();

const supportEscalationInput = z.object({
  title: z.string().min(4).max(180),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  category: z.enum(["connection", "billing", "security", "desktop_crash", "data_loss", "other"]),
  description: z.string().max(4000).optional()
});

const supportEscalationPatch = z.object({
  title: z.string().min(4).max(180).optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
  category: z.enum(["connection", "billing", "security", "desktop_crash", "data_loss", "other"]).optional(),
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  assignedToUserId: z.string().uuid().nullable().optional(),
  description: z.string().max(4000).optional()
});

router.get("/readiness", asyncHandler<AuthedRequest>(async (req, res) => {
  await ensureDefaultLaunchChecks(req.user!.id);

  const [checks, releaseCandidates, rolloutApprovals, migrationChecks, supportEscalations] = await Promise.all([
    prisma.launchCheck.findMany({
      orderBy: [{ required: "desc" }, { area: "asc" }, { key: "asc" }]
    }),
    prisma.releaseCandidate.findMany({
      include: {
        approvals: { orderBy: { createdAt: "desc" }, take: 8 },
        migrationChecks: { orderBy: { createdAt: "desc" }, take: 8 },
        createdBy: { select: { id: true, email: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 20
    }),
    prisma.rolloutApproval.findMany({
      include: { requestedBy: { select: { id: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 20
    }),
    prisma.migrationCheck.findMany({
      include: { releaseCandidate: { select: { id: true, version: true, gitSha: true } } },
      orderBy: { createdAt: "desc" },
      take: 30
    }),
    prisma.supportEscalation.findMany({
      include: {
        createdBy: { select: { id: true, email: true } },
        assignedTo: { select: { id: true, email: true } }
      },
      where: { status: { in: ["open", "in_progress"] } },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: 25
    })
  ]);

  const summary = summarizePersistedLaunchChecks(checks);

  res.json({
    success: true,
    data: {
      blocked: summary.blocked,
      counts: summary.counts,
      checks,
      releaseCandidates,
      rolloutApprovals,
      migrationChecks,
      supportEscalations
    }
  });
}));

router.patch("/checks/:key", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = launchCheckPatch.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const check = await prisma.launchCheck.update({
    where: { key: req.params.key },
    data: input.data
  });

  res.json({ success: true, data: check });
}));

router.post("/release-candidates", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = releaseCandidateInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const status = deriveReleaseCandidateStatus(input.data);
  const candidate = await prisma.releaseCandidate.create({
    data: {
      ...input.data,
      status,
      createdByUserId: req.user!.id
    }
  });

  res.status(201).json({ success: true, data: candidate });
}));

router.patch("/release-candidates/:id", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = releaseCandidatePatch.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const existing = await prisma.releaseCandidate.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ success: false, message: "Release candidate not found" });

  const merged = {
    version: input.data.version ?? existing.version,
    gitSha: input.data.gitSha ?? existing.gitSha,
    signedDesktopBuild: input.data.signedDesktopBuild ?? existing.signedDesktopBuild,
    migrationsReviewed: input.data.migrationsReviewed ?? existing.migrationsReviewed,
    smokeTestsPassed: input.data.smokeTestsPassed ?? existing.smokeTestsPassed
  };
  const status = input.data.status ?? deriveReleaseCandidateStatus(merged);

  const updated = await prisma.releaseCandidate.update({
    where: { id: existing.id },
    data: {
      ...input.data,
      status,
      promotedAt: status === "promoted" ? new Date() : existing.promotedAt
    }
  });

  res.json({ success: true, data: updated });
}));

router.post("/rollout-approvals", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = rolloutApprovalInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const approval = await prisma.rolloutApproval.create({
    data: {
      ...input.data,
      requestedByUserId: req.user!.id,
      decidedAt: input.data.decision === "pending" ? undefined : new Date()
    }
  });

  res.status(201).json({ success: true, data: approval });
}));

router.patch("/rollout-approvals/:id", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = rolloutApprovalPatch.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const approval = await prisma.rolloutApproval.update({
    where: { id: req.params.id },
    data: {
      ...input.data,
      decidedAt: input.data.decision === "pending" ? null : new Date()
    }
  });

  res.json({ success: true, data: approval });
}));

router.post("/migration-checks", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = migrationCheckInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const risk = classifyPersistedMigrationRisk(input.data);
  const check = await prisma.migrationCheck.create({
    data: {
      ...input.data,
      risk,
      createdByUserId: req.user!.id
    }
  });

  res.status(201).json({ success: true, data: check });
}));

router.patch("/migration-checks/:id", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = migrationCheckPatch.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const existing = await prisma.migrationCheck.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ success: false, message: "Migration check not found" });

  const risk = classifyPersistedMigrationRisk({
    touchesAuth: input.data.touchesAuth ?? existing.touchesAuth,
    touchesBilling: input.data.touchesBilling ?? existing.touchesBilling,
    destructive: input.data.destructive ?? existing.destructive,
    backfillRows: input.data.backfillRows ?? existing.backfillRows
  });

  const check = await prisma.migrationCheck.update({
    where: { id: existing.id },
    data: {
      ...input.data,
      risk
    }
  });

  res.json({ success: true, data: check });
}));

router.post("/support-escalations", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = supportEscalationInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const target = deriveEscalationTarget(input.data);
  const escalation = await prisma.supportEscalation.create({
    data: {
      ...input.data,
      target,
      createdByUserId: req.user!.id
    }
  });

  res.status(201).json({ success: true, data: escalation });
}));

router.patch("/support-escalations/:id", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = supportEscalationPatch.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const existing = await prisma.supportEscalation.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ success: false, message: "Support escalation not found" });

  const nextPriority = input.data.priority ?? (existing.priority as "low" | "normal" | "high" | "urgent");
  const nextCategory =
    input.data.category ??
    (existing.category as "connection" | "billing" | "security" | "desktop_crash" | "data_loss" | "other");
  const target = deriveEscalationTarget({ priority: nextPriority, category: nextCategory });
  const nextStatus = input.data.status ?? existing.status;

  const escalation = await prisma.supportEscalation.update({
    where: { id: existing.id },
    data: {
      ...input.data,
      target,
      resolvedAt: nextStatus === "resolved" || nextStatus === "closed" ? new Date() : existing.resolvedAt
    }
  });

  res.json({ success: true, data: escalation });
}));

export default router;
