import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { z } from "zod";
import { aiService } from "../lib/ai.js";

const router = Router();
router.use(requireAuth);

// --- Diagnostics ---

const analyzeStateSchema = z.object({
  deviceId: z.string().uuid(),
  systemState: z.object({
    cpuUsage: z.number(),
    memoryUsage: z.number(),
    totalMemory: z.number(),
    diskUsage: z.number(),
    totalDisk: z.number(),
    activeProcesses: z.array(z.string()),
    recentErrors: z.array(z.string()),
    osVersion: z.string()
  })
});

router.post("/diagnostics/analyze", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = analyzeStateSchema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const { deviceId, systemState } = input.data;

  // Verify device access
  const device = await prisma.device.findFirst({
    where: { id: deviceId }
  });
  if (!device) return res.status(404).json({ success: false, message: "Device not found" });

  // Generate AI analysis
  const analysis = await aiService.analyzeSystemState(systemState);

  // Save report
  const report = await prisma.diagnosticReport.create({
    data: {
      deviceId,
      cpuStatus: analysis.cpuStatus,
      memoryStatus: analysis.memoryStatus,
      diskStatus: analysis.diskStatus,
      networkStatus: analysis.networkStatus,
      securityStatus: analysis.securityStatus,
      aiAnalysis: analysis.analysis,
      recommendedActions: analysis.recommendedActions
    }
  });

  res.json({ success: true, data: report });
}));

router.get("/diagnostics/device/:deviceId", asyncHandler<AuthedRequest>(async (req, res) => {
  const { deviceId } = req.params;
  
  const reports = await prisma.diagnosticReport.findMany({
    where: { deviceId },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  res.json({ success: true, data: reports });
}));


// --- Natural Language Commands & Auto-Fix ---

const parseCommandSchema = z.object({
  deviceId: z.string().uuid(),
  command: z.string()
});

router.post("/commands/parse", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = parseCommandSchema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const { deviceId, command } = input.data;

  const device = await prisma.device.findFirst({
    where: { id: deviceId }
  });
  if (!device) return res.status(404).json({ success: false, message: "Device not found" });

  const action = await aiService.parseNaturalLanguageCommand(command, device.platform);

  res.json({ success: true, data: action });
}));

const generateScriptSchema = z.object({
  deviceId: z.string().uuid(),
  issue: z.string()
});

router.post("/commands/generate-script", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = generateScriptSchema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const { deviceId, issue } = input.data;

  const device = await prisma.device.findFirst({
    where: { id: deviceId }
  });
  if (!device) return res.status(404).json({ success: false, message: "Device not found" });

  const scriptResult = await aiService.generateFixScript(issue, device.platform);

  res.json({ success: true, data: scriptResult });
}));


// --- Support Tickets ---

const createTicketSchema = z.object({
  deviceId: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium")
});

router.post("/tickets", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = createTicketSchema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const ticket = await prisma.supportTicket.create({
    data: {
      ...input.data,
      userId: req.user!.id
    }
  });

  res.status(201).json({ success: true, data: ticket });
}));

router.get("/tickets", asyncHandler<AuthedRequest>(async (req, res) => {
  const tickets = await prisma.supportTicket.findMany({
    where: { userId: req.user!.id },
    include: { device: true },
    orderBy: { createdAt: "desc" }
  });

  res.json({ success: true, data: tickets });
}));

router.patch("/tickets/:id/resolve", asyncHandler<AuthedRequest>(async (req, res) => {
  const { id } = req.params;
  const { resolution } = req.body;

  const ticket = await prisma.supportTicket.update({
    where: { id },
    data: {
      status: "resolved",
      aiResolution: resolution
    }
  });

  res.json({ success: true, data: ticket });
}));


// --- Session Replay & Summary ---

const saveReplaySchema = z.object({
  sessionId: z.string().uuid(),
  eventsJson: z.string()
});

router.post("/replays", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = saveReplaySchema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const { sessionId, eventsJson } = input.data;

  // Generate summary
  const summaryResult = await aiService.summarizeSession(eventsJson);

  const replay = await prisma.sessionReplay.create({
    data: {
      sessionId,
      eventsJson,
      aiSummary: JSON.stringify(summaryResult)
    }
  });

  res.status(201).json({ success: true, data: replay });
}));

router.get("/replays/:sessionId", asyncHandler<AuthedRequest>(async (req, res) => {
  const { sessionId } = req.params;

  const replay = await prisma.sessionReplay.findUnique({
    where: { sessionId }
  });

  if (!replay) return res.status(404).json({ success: false, message: "Replay not found" });

  res.json({ success: true, data: replay });
}));


// --- Predictive Maintenance ---

router.get("/predictive-alerts/device/:deviceId", asyncHandler<AuthedRequest>(async (req, res) => {
  const { deviceId } = req.params;

  const alerts = await prisma.predictiveAlert.findMany({
    where: { deviceId, isResolved: false },
    orderBy: { confidenceScore: "desc" }
  });

  res.json({ success: true, data: alerts });
}));

export default router;
