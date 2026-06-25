import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import dgram from "node:dgram";
import os from "node:os";

const router = Router();
const prisma = new PrismaClient();

// ─── Helper: Send Wake-on-LAN magic packet ────────────────────────────────────

function sendWolMagicPacket(macAddress: string, broadcastIp: string, port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    // Normalize MAC address (remove colons/dashes)
    const mac = macAddress.replace(/[:\-]/g, "");
    if (mac.length !== 12) {
      return reject(new Error("Invalid MAC address format"));
    }

    // Build magic packet: 6 bytes of 0xFF + 16 repetitions of the MAC address
    const macBytes = Buffer.from(mac, "hex");
    const packet = Buffer.alloc(102);
    packet.fill(0xff, 0, 6);
    for (let i = 1; i <= 16; i++) {
      macBytes.copy(packet, i * 6);
    }

    const socket = dgram.createSocket("udp4");
    socket.once("error", (err) => { socket.close(); reject(err); });
    socket.bind(() => {
      socket.setBroadcast(true);
      socket.send(packet, 0, packet.length, port, broadcastIp, (err) => {
        socket.close();
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

// ─── Streaming Profiles ───────────────────────────────────────────────────────

// GET /api/cloud-gaming/profiles
router.get("/profiles", requireAuth, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const profiles = await prisma.streamingProfile.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }]
  });
  res.json({ success: true, data: profiles });
}));

// POST /api/cloud-gaming/profiles
router.post("/profiles", requireAuth, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const {
    name, codec = "h264", encoder = "software", resolution = "1920x1080",
    framerate = 60, bitrate = 20000, minBitrate = 5000, maxBitrate = 50000,
    adaptiveBitrate = true, hdrEnabled = false, hdrFormat, audioChannels = 2,
    audioCodec = "opus", latencyMode = "balanced", roiEnabled = false, isDefault = false
  } = req.body;

  if (!name) return res.status(400).json({ success: false, message: "Profile name is required" });

  // If this is the default, unset other defaults
  if (isDefault) {
    await prisma.streamingProfile.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
  }

  const profile = await prisma.streamingProfile.create({
    data: {
      userId, name, codec, encoder, resolution, framerate, bitrate,
      minBitrate, maxBitrate, adaptiveBitrate, hdrEnabled, hdrFormat,
      audioChannels, audioCodec, latencyMode, roiEnabled, isDefault
    }
  });
  res.status(201).json({ success: true, data: profile });
}));

// PUT /api/cloud-gaming/profiles/:id
router.put("/profiles/:id", requireAuth, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const profile = await prisma.streamingProfile.findFirst({ where: { id, userId } });
  if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

  if (req.body.isDefault) {
    await prisma.streamingProfile.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
  }

  const updated = await prisma.streamingProfile.update({ where: { id }, data: req.body });
  res.json({ success: true, data: updated });
}));

// DELETE /api/cloud-gaming/profiles/:id
router.delete("/profiles/:id", requireAuth, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const profile = await prisma.streamingProfile.findFirst({ where: { id, userId } });
  if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
  await prisma.streamingProfile.delete({ where: { id } });
  res.json({ success: true, message: "Profile deleted" });
}));

// ─── Hardware Encoder Detection ───────────────────────────────────────────────

// POST /api/cloud-gaming/encoders/report
router.post("/encoders/report", requireAuth, asyncHandler(async (req, res) => {
  const { deviceId, encoders } = req.body;
  if (!deviceId || !Array.isArray(encoders)) {
    return res.status(400).json({ success: false, message: "deviceId and encoders array required" });
  }

  // Upsert each reported encoder
  const results = await Promise.all(
    encoders.map((enc: { type: string; name: string; vendor: string; codecs: string[]; maxWidth?: number; maxHeight?: number; maxFps?: number }) =>
      prisma.hardwareEncoder.upsert({
        where: { id: `${deviceId}-${enc.type}` },
        create: {
          id: `${deviceId}-${enc.type}`,
          deviceId,
          type: enc.type,
          name: enc.name,
          vendor: enc.vendor,
          codecs: JSON.stringify(enc.codecs),
          maxWidth: enc.maxWidth || 3840,
          maxHeight: enc.maxHeight || 2160,
          maxFps: enc.maxFps || 60,
          available: true
        },
        update: {
          name: enc.name,
          vendor: enc.vendor,
          codecs: JSON.stringify(enc.codecs),
          available: true,
          detectedAt: new Date()
        }
      })
    )
  );

  res.json({ success: true, data: results });
}));

// GET /api/cloud-gaming/encoders/:deviceId
router.get("/encoders/:deviceId", requireAuth, asyncHandler(async (req, res) => {
  const encoders = await prisma.hardwareEncoder.findMany({
    where: { deviceId: req.params.deviceId },
    orderBy: { detectedAt: "desc" }
  });
  res.json({ success: true, data: encoders });
}));

// ─── Game Detection ───────────────────────────────────────────────────────────

// POST /api/cloud-gaming/games/report
router.post("/games/report", requireAuth, asyncHandler(async (req, res) => {
  const { deviceId, games } = req.body;
  if (!deviceId || !Array.isArray(games)) {
    return res.status(400).json({ success: false, message: "deviceId and games array required" });
  }

  // Mark all existing games as not running first
  await prisma.detectedGame.updateMany({ where: { deviceId }, data: { isRunning: false } });

  const results = await Promise.all(
    games.map((g: { name: string; processName: string; platform?: string; isRunning?: boolean; recommendedProfile?: string }) =>
      prisma.detectedGame.upsert({
        where: { id: `${deviceId}-${g.processName}` },
        create: {
          id: `${deviceId}-${g.processName}`,
          deviceId,
          name: g.name,
          processName: g.processName,
          platform: g.platform || "unknown",
          isRunning: g.isRunning || false,
          recommendedProfile: g.recommendedProfile,
          lastSeen: new Date()
        },
        update: {
          name: g.name,
          platform: g.platform || "unknown",
          isRunning: g.isRunning || false,
          recommendedProfile: g.recommendedProfile,
          lastSeen: new Date()
        }
      })
    )
  );

  res.json({ success: true, data: results });
}));

// GET /api/cloud-gaming/games/:deviceId
router.get("/games/:deviceId", requireAuth, asyncHandler(async (req, res) => {
  const games = await prisma.detectedGame.findMany({
    where: { deviceId: req.params.deviceId },
    orderBy: [{ isRunning: "desc" }, { lastSeen: "desc" }]
  });
  res.json({ success: true, data: games });
}));

// ─── Gaming Sessions ──────────────────────────────────────────────────────────

// POST /api/cloud-gaming/sessions/start
router.post("/sessions/start", requireAuth, asyncHandler(async (req, res) => {
  const { sessionId, profileId, encoderUsed, controllerConnected, hdrActive, gameDetected } = req.body;
  if (!sessionId) return res.status(400).json({ success: false, message: "sessionId required" });

  const gamingSession = await prisma.gamingSession.upsert({
    where: { sessionId },
    create: { sessionId, profileId, encoderUsed, controllerConnected: controllerConnected || false, hdrActive: hdrActive || false, gameDetected },
    update: { profileId, encoderUsed, controllerConnected: controllerConnected || false, hdrActive: hdrActive || false, gameDetected }
  });
  res.json({ success: true, data: gamingSession });
}));

// POST /api/cloud-gaming/sessions/:sessionId/end
router.post("/sessions/:sessionId/end", requireAuth, asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { avgFps, avgLatency, avgBitrate, peakBitrate, totalFrames, droppedFrames } = req.body;

  const gamingSession = await prisma.gamingSession.update({
    where: { sessionId },
    data: { endedAt: new Date(), avgFps, avgLatency, avgBitrate, peakBitrate, totalFrames, droppedFrames }
  });
  res.json({ success: true, data: gamingSession });
}));

// GET /api/cloud-gaming/sessions/:sessionId
router.get("/sessions/:sessionId", requireAuth, asyncHandler(async (req, res) => {
  const gamingSession = await prisma.gamingSession.findUnique({ where: { sessionId: req.params.sessionId } });
  if (!gamingSession) return res.status(404).json({ success: false, message: "Gaming session not found" });
  res.json({ success: true, data: gamingSession });
}));

// ─── Performance Snapshots ────────────────────────────────────────────────────

// POST /api/cloud-gaming/performance/:sessionId
router.post("/performance/:sessionId", requireAuth, asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { fps, latencyMs, bitrateKbps, packetLoss, encodeTimeMs, decodeTimeMs, rttMs, jitterMs } = req.body;

  const snap = await prisma.performanceSnapshot.create({
    data: { sessionId, fps: fps || 0, latencyMs: latencyMs || 0, bitrateKbps: bitrateKbps || 0, packetLoss: packetLoss || 0, encodeTimeMs: encodeTimeMs || 0, decodeTimeMs: decodeTimeMs || 0, rttMs: rttMs || 0, jitterMs: jitterMs || 0 }
  });
  res.json({ success: true, data: snap });
}));

// GET /api/cloud-gaming/performance/:sessionId
router.get("/performance/:sessionId", requireAuth, asyncHandler(async (req, res) => {
  const snaps = await prisma.performanceSnapshot.findMany({
    where: { sessionId: req.params.sessionId },
    orderBy: { timestamp: "asc" },
    take: 300 // last 5 minutes at 1/sec
  });
  res.json({ success: true, data: snaps });
}));

// ─── Wake-on-LAN ──────────────────────────────────────────────────────────────

// GET /api/cloud-gaming/wol
router.get("/wol", requireAuth, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const targets = await prisma.wakeOnLanTarget.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
  res.json({ success: true, data: targets });
}));

// POST /api/cloud-gaming/wol
router.post("/wol", requireAuth, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const { name, macAddress, broadcastIp = "255.255.255.255", port = 9, deviceId } = req.body;
  if (!name || !macAddress) return res.status(400).json({ success: false, message: "name and macAddress required" });

  const target = await prisma.wakeOnLanTarget.create({
    data: { userId, name, macAddress, broadcastIp, port, deviceId }
  });
  res.status(201).json({ success: true, data: target });
}));

// POST /api/cloud-gaming/wol/:id/wake
router.post("/wol/:id/wake", requireAuth, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const target = await prisma.wakeOnLanTarget.findFirst({ where: { id: req.params.id, userId } });
  if (!target) return res.status(404).json({ success: false, message: "WoL target not found" });

  try {
    await sendWolMagicPacket(target.macAddress, target.broadcastIp, target.port);
    await prisma.wakeOnLanTarget.update({ where: { id: target.id }, data: { lastWoken: new Date() } });
    res.json({ success: true, message: `Magic packet sent to ${target.macAddress}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err instanceof Error ? err.message : "Failed to send WoL packet" });
  }
}));

// DELETE /api/cloud-gaming/wol/:id
router.delete("/wol/:id", requireAuth, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const target = await prisma.wakeOnLanTarget.findFirst({ where: { id: req.params.id, userId } });
  if (!target) return res.status(404).json({ success: false, message: "WoL target not found" });
  await prisma.wakeOnLanTarget.delete({ where: { id: target.id } });
  res.json({ success: true, message: "WoL target deleted" });
}));

// ─── Adaptive Bitrate Recommendation ─────────────────────────────────────────

// POST /api/cloud-gaming/abr/recommend
router.post("/abr/recommend", requireAuth, asyncHandler(async (req, res) => {
  const { rttMs, packetLoss, currentBitrate, targetLatencyMs = 16 } = req.body;

  let recommendedBitrate = currentBitrate || 20000;
  let quality = "good";
  let action = "maintain";

  // Simple ABR algorithm
  if (packetLoss > 5 || rttMs > 100) {
    recommendedBitrate = Math.max(2000, Math.round(currentBitrate * 0.7));
    quality = "poor";
    action = "decrease";
  } else if (packetLoss > 2 || rttMs > 50) {
    recommendedBitrate = Math.max(5000, Math.round(currentBitrate * 0.85));
    quality = "fair";
    action = "decrease_mild";
  } else if (packetLoss < 0.5 && rttMs < 20) {
    recommendedBitrate = Math.min(50000, Math.round(currentBitrate * 1.15));
    quality = "excellent";
    action = "increase";
  }

  // Latency-based codec recommendation
  const codec = rttMs < 10 ? "h264" : rttMs < 30 ? "h265" : "h264";
  const latencyMode = rttMs < 8 ? "ultra_low" : rttMs < 16 ? "low" : rttMs < 50 ? "balanced" : "quality";

  res.json({
    success: true,
    data: {
      recommendedBitrate,
      quality,
      action,
      codec,
      latencyMode,
      rttMs,
      packetLoss,
      targetLatencyMs
    }
  });
}));

// ─── Streaming Stats Summary ──────────────────────────────────────────────────

// GET /api/cloud-gaming/stats/summary
router.get("/stats/summary", requireAuth, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;

  const [totalSessions, profiles, wolTargets] = await Promise.all([
    prisma.gamingSession.count(),
    prisma.streamingProfile.count({ where: { userId } }),
    prisma.wakeOnLanTarget.count({ where: { userId } })
  ]);

  const recentSessions = await prisma.gamingSession.findMany({
    take: 10,
    orderBy: { startedAt: "desc" }
  });

  const avgFps = recentSessions.filter(s => s.avgFps).reduce((sum, s) => sum + (s.avgFps || 0), 0) / (recentSessions.filter(s => s.avgFps).length || 1);
  const avgLatency = recentSessions.filter(s => s.avgLatency).reduce((sum, s) => sum + (s.avgLatency || 0), 0) / (recentSessions.filter(s => s.avgLatency).length || 1);

  res.json({
    success: true,
    data: {
      totalSessions,
      profiles,
      wolTargets,
      avgFps: Math.round(avgFps * 10) / 10,
      avgLatency: Math.round(avgLatency * 10) / 10,
      recentSessions
    }
  });
}));

export default router;
