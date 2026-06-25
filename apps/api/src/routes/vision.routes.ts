import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { z } from "zod";

const router = Router();
router.use(requireAuth);

// Schema for creating a vision event
const createVisionEventSchema = z.object({
  sessionId: z.string().uuid(),
  eventType: z.string(), // "ocr", "error_detected", "bsod", "app_change", "idle", "face_detected", "object_detected", "anomaly"
  confidence: z.number().min(0).max(1).optional().default(0.0),
  metadata: z.record(z.any()).optional(),
});

// POST /api/vision/events - Create a new vision event
router.post("/events", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = createVisionEventSchema.safeParse(req.body);
  if (!input.success) {
    return res.status(400).json({ success: false, errors: input.error.flatten() });
  }

  // Verify the user has access to this session
  const session = await prisma.session.findUnique({
    where: { id: input.data.sessionId },
  });

  if (!session) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }

  if (session.clientId !== req.user!.id && session.hostId !== req.user!.id) {
    return res.status(403).json({ success: false, message: "Not authorized to access this session" });
  }

  const visionEvent = await prisma.visionEvent.create({
    data: {
      sessionId: input.data.sessionId,
      eventType: input.data.eventType,
      confidence: input.data.confidence,
      metadata: input.data.metadata || {},
    },
  });

  // Check if any alert configs match this event and trigger notifications
  await checkAndTriggerAlerts(session.hostId, visionEvent);

  res.status(201).json({ success: true, data: visionEvent });
}));

// GET /api/vision/events/:sessionId - Get vision events for a session
router.get("/events/:sessionId", asyncHandler<AuthedRequest>(async (req, res) => {
  const session = await prisma.session.findUnique({
    where: { id: req.params.sessionId },
  });

  if (!session) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }

  if (session.clientId !== req.user!.id && session.hostId !== req.user!.id) {
    return res.status(403).json({ success: false, message: "Not authorized to access this session" });
  }

  const events = await prisma.visionEvent.findMany({
    where: { sessionId: req.params.sessionId },
    orderBy: { timestamp: "desc" },
    take: 100,
  });

  res.json({ success: true, data: events });
}));

// GET /api/vision/events/:sessionId/type/:eventType - Get specific event types
router.get("/events/:sessionId/type/:eventType", asyncHandler<AuthedRequest>(async (req, res) => {
  const session = await prisma.session.findUnique({
    where: { id: req.params.sessionId },
  });

  if (!session) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }

  if (session.clientId !== req.user!.id && session.hostId !== req.user!.id) {
    return res.status(403).json({ success: false, message: "Not authorized to access this session" });
  }

  const events = await prisma.visionEvent.findMany({
    where: {
      sessionId: req.params.sessionId,
      eventType: req.params.eventType,
    },
    orderBy: { timestamp: "desc" },
    take: 50,
  });

  res.json({ success: true, data: events });
}));

// POST /api/vision/alerts - Create a new alert config
const createAlertConfigSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  triggerType: z.string(), // "text_contains", "text_matches", "error_detected", "bsod", "idle_duration", "app_change", "face_detected"
  triggerValue: z.string().optional(),
  action: z.string(), // "notification", "email", "webhook"
  actionTarget: z.string().optional(),
});

router.post("/alerts", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = createAlertConfigSchema.safeParse(req.body);
  if (!input.success) {
    return res.status(400).json({ success: false, errors: input.error.flatten() });
  }

  const alertConfig = await prisma.visionAlertConfig.create({
    data: {
      userId: req.user!.id,
      name: input.data.name,
      description: input.data.description,
      triggerType: input.data.triggerType,
      triggerValue: input.data.triggerValue,
      action: input.data.action,
      actionTarget: input.data.actionTarget,
    },
  });

  res.status(201).json({ success: true, data: alertConfig });
}));

// GET /api/vision/alerts - Get all alert configs for the user
router.get("/alerts", asyncHandler<AuthedRequest>(async (req, res) => {
  const alertConfigs = await prisma.visionAlertConfig.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, data: alertConfigs });
}));

// PATCH /api/vision/alerts/:id - Update an alert config
router.patch("/alerts/:id", asyncHandler<AuthedRequest>(async (req, res) => {
  const alertConfig = await prisma.visionAlertConfig.findUnique({
    where: { id: req.params.id },
  });

  if (!alertConfig) {
    return res.status(404).json({ success: false, message: "Alert config not found" });
  }

  if (alertConfig.userId !== req.user!.id) {
    return res.status(403).json({ success: false, message: "Not authorized to update this alert" });
  }

  const input = createAlertConfigSchema.partial().safeParse(req.body);
  if (!input.success) {
    return res.status(400).json({ success: false, errors: input.error.flatten() });
  }

  const updated = await prisma.visionAlertConfig.update({
    where: { id: req.params.id },
    data: input.data,
  });

  res.json({ success: true, data: updated });
}));

// DELETE /api/vision/alerts/:id - Delete an alert config
router.delete("/alerts/:id", asyncHandler<AuthedRequest>(async (req, res) => {
  const alertConfig = await prisma.visionAlertConfig.findUnique({
    where: { id: req.params.id },
  });

  if (!alertConfig) {
    return res.status(404).json({ success: false, message: "Alert config not found" });
  }

  if (alertConfig.userId !== req.user!.id) {
    return res.status(403).json({ success: false, message: "Not authorized to delete this alert" });
  }

  await prisma.visionAlertConfig.delete({
    where: { id: req.params.id },
  });

  res.json({ success: true, message: "Alert config deleted" });
}));

// GET /api/vision/analytics/:sessionId - Get analytics for a session
router.get("/analytics/:sessionId", asyncHandler<AuthedRequest>(async (req, res) => {
  const session = await prisma.session.findUnique({
    where: { id: req.params.sessionId },
  });

  if (!session) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }

  if (session.clientId !== req.user!.id && session.hostId !== req.user!.id) {
    return res.status(403).json({ success: false, message: "Not authorized to access this session" });
  }

  const analytics = await prisma.visionAnalytics.findUnique({
    where: { sessionId: req.params.sessionId },
  });

  if (!analytics) {
    return res.status(404).json({ success: false, message: "Analytics not found for this session" });
  }

  res.json({ success: true, data: analytics });
}));

// POST /api/vision/analytics/:sessionId - Create or update analytics for a session
const updateAnalyticsSchema = z.object({
  totalScreenTime: z.number().optional(),
  appCategories: z.record(z.number()).optional(),
  websiteCategories: z.record(z.number()).optional(),
  idleTime: z.number().optional(),
  productivityScore: z.number().min(0).max(100).optional(),
});

router.post("/analytics/:sessionId", asyncHandler<AuthedRequest>(async (req, res) => {
  const session = await prisma.session.findUnique({
    where: { id: req.params.sessionId },
  });

  if (!session) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }

  if (session.clientId !== req.user!.id && session.hostId !== req.user!.id) {
    return res.status(403).json({ success: false, message: "Not authorized to access this session" });
  }

  const input = updateAnalyticsSchema.safeParse(req.body);
  if (!input.success) {
    return res.status(400).json({ success: false, errors: input.error.flatten() });
  }

  let analytics = await prisma.visionAnalytics.findUnique({
    where: { sessionId: req.params.sessionId },
  });

  if (!analytics) {
    analytics = await prisma.visionAnalytics.create({
      data: {
        sessionId: req.params.sessionId,
        ...input.data,
      },
    });
  } else {
    analytics = await prisma.visionAnalytics.update({
      where: { sessionId: req.params.sessionId },
      data: input.data,
    });
  }

  res.json({ success: true, data: analytics });
}));

// Helper function to check and trigger alerts
async function checkAndTriggerAlerts(userId: string, event: any) {
  const alertConfigs = await prisma.visionAlertConfig.findMany({
    where: {
      userId,
      enabled: true,
    },
  });

  for (const config of alertConfigs) {
    let shouldTrigger = false;

    if (config.triggerType === "text_contains" && event.eventType === "ocr") {
      const ocrText = event.metadata?.text || "";
      shouldTrigger = ocrText.toLowerCase().includes(config.triggerValue?.toLowerCase() || "");
    } else if (config.triggerType === "text_matches" && event.eventType === "ocr") {
      const ocrText = event.metadata?.text || "";
      shouldTrigger = ocrText.toLowerCase() === config.triggerValue?.toLowerCase();
    } else if (config.triggerType === "error_detected" && event.eventType === "error_detected") {
      shouldTrigger = true;
    } else if (config.triggerType === "bsod" && event.eventType === "bsod") {
      shouldTrigger = true;
    } else if (config.triggerType === "face_detected" && event.eventType === "face_detected") {
      shouldTrigger = true;
    }

    if (shouldTrigger) {
      // TODO: Implement actual notification sending
      console.log(`Alert triggered: ${config.name} (${config.action})`);
      if (config.action === "webhook" && config.actionTarget) {
        // Send webhook
        try {
          await fetch(config.actionTarget, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              alertName: config.name,
              event,
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (error) {
          console.error(`Failed to send webhook: ${error}`);
        }
      }
    }
  }
}

export default router;
