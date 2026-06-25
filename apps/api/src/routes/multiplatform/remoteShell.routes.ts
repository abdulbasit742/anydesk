import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { remoteShellManager } from "../../services/remoteShell.js";
import { prisma } from "../../lib/prisma.js";

const router = Router();
router.use(requireAuth);

const createSessionInput = z.object({
  deviceId: z.string().uuid(),
  shell: z.enum(["bash", "sh", "zsh", "powershell"]).optional(),
  cols: z.number().int().min(40).max(500).optional(),
  rows: z.number().int().min(10).max(200).optional()
});

const executeCommandInput = z.object({
  command: z.string().min(1).max(10000)
});

const resizeInput = z.object({
  cols: z.number().int().min(40).max(500),
  rows: z.number().int().min(10).max(200)
});

// Create remote shell session
router.post("/sessions", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = createSessionInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  // Verify device ownership
  const device = await prisma.device.findFirst({
    where: {
      id: input.data.deviceId,
      userId: req.user!.id
    }
  });

  if (!device) return res.status(404).json({ success: false, message: "Device not found" });

  try {
    const sessionToken = await remoteShellManager.createSession(
      input.data.deviceId,
      req.user!.id,
      {
        shell: input.data.shell,
        cols: input.data.cols,
        rows: input.data.rows
      }
    );

    res.status(201).json({
      success: true,
      data: {
        sessionToken,
        deviceId: input.data.deviceId,
        shell: input.data.shell || "bash"
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// Get session info
router.get("/sessions/:sessionToken", asyncHandler<AuthedRequest>(async (req, res) => {
  try {
    const session = await prisma.remoteShellSession.findUnique({
      where: { sessionToken: req.params.sessionToken }
    });

    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    // Verify user owns the session
    if (session.userId !== req.user!.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.json({
      success: true,
      data: {
        sessionToken: session.sessionToken,
        deviceId: session.deviceId,
        shell: session.shell,
        status: session.status,
        startedAt: session.startedAt,
        endedAt: session.endedAt
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// Execute command in session
router.post("/sessions/:sessionToken/execute", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = executeCommandInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  try {
    const session = await prisma.remoteShellSession.findUnique({
      where: { sessionToken: req.params.sessionToken }
    });

    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    if (session.userId !== req.user!.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (session.status !== "active") {
      return res.status(400).json({ success: false, message: "Session is not active" });
    }

    await remoteShellManager.executeCommand(req.params.sessionToken, input.data.command);

    res.json({ success: true, message: "Command executed" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// Get session output
router.get("/sessions/:sessionToken/output", asyncHandler<AuthedRequest>(async (req, res) => {
  try {
    const session = await prisma.remoteShellSession.findUnique({
      where: { sessionToken: req.params.sessionToken }
    });

    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    if (session.userId !== req.user!.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const output = remoteShellManager.getSessionOutput(req.params.sessionToken);

    res.json({
      success: true,
      data: {
        output,
        sessionToken: req.params.sessionToken
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// Clear session output
router.delete("/sessions/:sessionToken/output", asyncHandler<AuthedRequest>(async (req, res) => {
  try {
    const session = await prisma.remoteShellSession.findUnique({
      where: { sessionToken: req.params.sessionToken }
    });

    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    if (session.userId !== req.user!.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    remoteShellManager.clearSessionOutput(req.params.sessionToken);

    res.json({ success: true, message: "Output cleared" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// Resize terminal
router.post("/sessions/:sessionToken/resize", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = resizeInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  try {
    const session = await prisma.remoteShellSession.findUnique({
      where: { sessionToken: req.params.sessionToken }
    });

    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    if (session.userId !== req.user!.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await remoteShellManager.resizeTerminal(
      req.params.sessionToken,
      input.data.cols,
      input.data.rows
    );

    res.json({ success: true, message: "Terminal resized" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// Close session
router.delete("/sessions/:sessionToken", asyncHandler<AuthedRequest>(async (req, res) => {
  try {
    const session = await prisma.remoteShellSession.findUnique({
      where: { sessionToken: req.params.sessionToken }
    });

    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    if (session.userId !== req.user!.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await remoteShellManager.closeSession(req.params.sessionToken);

    res.json({ success: true, message: "Session closed" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

// List active sessions for a device
router.get("/devices/:deviceId/sessions", asyncHandler<AuthedRequest>(async (req, res) => {
  try {
    const device = await prisma.device.findFirst({
      where: {
        id: req.params.deviceId,
        userId: req.user!.id
      }
    });

    if (!device) return res.status(404).json({ success: false, message: "Device not found" });

    const sessions = await prisma.remoteShellSession.findMany({
      where: {
        deviceId: req.params.deviceId,
        status: "active"
      },
      select: {
        sessionToken: true,
        shell: true,
        startedAt: true,
        status: true
      }
    });

    res.json({ success: true, data: sessions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}));

export default router;
