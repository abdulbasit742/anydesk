import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { adaptiveStreamingService } from "../../services/connection-optimizer/adaptive-streaming.service.js";
import { multipathService } from "../../services/connection-optimizer/multipath.service.js";
import { diagnosticsService } from "../../services/connection-optimizer/diagnostics.service.js";
import { bandwidthService } from "../../services/connection-optimizer/bandwidth.service.js";

const router = Router();
router.use(requireAuth);

// ============================================================================
// ADAPTIVE STREAMING
// ============================================================================

// Get optimal quality profile based on current metrics
router.post(
  "/quality/optimize",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { bandwidth, latency, packetLoss, jitter } = req.body;
    const result = adaptiveStreamingService.determineQualityProfile({
      bandwidth,
      latency,
      packetLoss,
      jitter,
    });
    res.json({ success: true, data: result });
  })
);

// Get compression strategy for current frame
router.post(
  "/compression/strategy",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const strategy = adaptiveStreamingService.getCompressionStrategy(req.body);
    res.json({ success: true, data: strategy });
  })
);

// Get protocol recommendation
router.post(
  "/protocol/select",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const protocol = adaptiveStreamingService.selectProtocol(req.body);
    res.json({ success: true, data: { protocol } });
  })
);

// Predict next frame
router.post(
  "/predict/frame",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { history } = req.body;
    const prediction = adaptiveStreamingService.predictNextFrame(history);
    res.json({ success: true, data: prediction });
  })
);

// Record quality adaptation event
router.post(
  "/quality/adaptation",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { sessionId, reason, previous, current, aiConfidence } = req.body;
    const event = await adaptiveStreamingService.recordAdaptation(
      sessionId,
      reason,
      previous,
      current,
      aiConfidence
    );
    res.status(201).json({ success: true, data: event });
  })
);

// ============================================================================
// MULTI-PATH CONNECTION
// ============================================================================

// Record path metrics
router.post(
  "/multipath/metrics",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { sessionId, paths } = req.body;
    const records = await multipathService.recordPathMetrics(sessionId, paths);
    res.status(201).json({ success: true, data: records });
  })
);

// Get traffic distribution recommendation
router.post(
  "/multipath/distribute",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { paths } = req.body;
    const distribution = multipathService.calculateTrafficDistribution(paths);
    res.json({ success: true, data: distribution });
  })
);

// Check failover status
router.post(
  "/multipath/failover",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { paths } = req.body;
    const failover = multipathService.detectFailover(paths);
    res.json({ success: true, data: failover });
  })
);

// Get bonded bandwidth info
router.post(
  "/multipath/bonded",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { paths } = req.body;
    const bonded = multipathService.calculateBondedBandwidth(paths);
    res.json({ success: true, data: bonded });
  })
);

// ============================================================================
// NETWORK DIAGNOSTICS
// ============================================================================

// Run speed test
router.post(
  "/speedtest",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const result = await diagnosticsService.recordSpeedTest(req.user!.id, req.body.deviceId, req.body);
    res.status(201).json({ success: true, data: result });
  })
);

// Get speed test history
router.get(
  "/speedtest/history",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, limit } = req.query;
    const history = await diagnosticsService.getSpeedTestHistory(
      req.user!.id,
      deviceId as string,
      parseInt(limit as string) || 20
    );
    res.json({ success: true, data: history });
  })
);

// Start network diagnostic
router.post(
  "/diagnostics/start",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, diagnosticType, remoteDeviceId } = req.body;
    const diagnostic = await diagnosticsService.startDiagnostic(
      req.user!.id,
      deviceId,
      diagnosticType,
      remoteDeviceId
    );
    res.status(201).json({ success: true, data: diagnostic });
  })
);

// Complete diagnostic
router.post(
  "/diagnostics/:diagnosticId/complete",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { diagnosticId } = req.params;
    const diagnostic = await diagnosticsService.completeDiagnostic(diagnosticId, req.body);
    res.json({ success: true, data: diagnostic });
  })
);

// Get diagnostic history
router.get(
  "/diagnostics/history",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, limit } = req.query;
    const history = await diagnosticsService.getDiagnosticHistory(
      req.user!.id,
      deviceId as string,
      parseInt(limit as string) || 20
    );
    res.json({ success: true, data: history });
  })
);

// "Why is it slow?" analysis
router.post(
  "/diagnostics/why-slow",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, sessionId } = req.body;
    const analysis = await diagnosticsService.analyzeSlowConnection(
      req.user!.id,
      deviceId,
      sessionId
    );
    res.json({ success: true, data: analysis });
  })
);

// Get connection quality history
router.get(
  "/quality/history",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, days } = req.query;
    const history = await diagnosticsService.getQualityHistory(
      req.user!.id,
      deviceId as string,
      parseInt(days as string) || 30
    );
    res.json({ success: true, data: history });
  })
);

// ============================================================================
// BANDWIDTH SCHEDULING
// ============================================================================

// Create bandwidth schedule
router.post(
  "/bandwidth/schedule",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const schedule = await bandwidthService.createSchedule(req.user!.id, req.body);
    res.status(201).json({ success: true, data: schedule });
  })
);

// Get bandwidth schedules
router.get(
  "/bandwidth/schedules",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId } = req.query;
    const schedules = await bandwidthService.getSchedules(req.user!.id, deviceId as string);
    res.json({ success: true, data: schedules });
  })
);

// Get active bandwidth limit
router.get(
  "/bandwidth/active-limit",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId } = req.query;
    const limit = await bandwidthService.getActiveBandwidthLimit(req.user!.id, deviceId as string);
    res.json({ success: true, data: { limit, unlimited: limit === null } });
  })
);

// Update bandwidth schedule
router.put(
  "/bandwidth/schedule/:scheduleId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { scheduleId } = req.params;
    const schedule = await bandwidthService.updateSchedule(scheduleId, req.body);
    res.json({ success: true, data: schedule });
  })
);

// Delete bandwidth schedule
router.delete(
  "/bandwidth/schedule/:scheduleId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { scheduleId } = req.params;
    await bandwidthService.deleteSchedule(scheduleId);
    res.json({ success: true });
  })
);

// ============================================================================
// RELAY NETWORK
// ============================================================================

// Get relay nodes
router.get(
  "/relay/nodes",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { region } = req.query;
    const nodes = await bandwidthService.getRelayNodes(region as string);
    res.json({ success: true, data: nodes });
  })
);

// Find best relay
router.post(
  "/relay/find-best",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { userRegion, remoteRegion } = req.body;
    const relay = await bandwidthService.findBestRelay(userRegion, remoteRegion);
    res.json({ success: true, data: relay });
  })
);

// Register contributed relay
router.post(
  "/relay/contribute",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const relay = await bandwidthService.registerContributedRelay(req.user!.id, req.body);
    res.status(201).json({ success: true, data: relay });
  })
);

// Get relay network stats
router.get(
  "/relay/stats",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const stats = await bandwidthService.getRelayNetworkStats();
    res.json({ success: true, data: stats });
  })
);

// ============================================================================
// CONNECTION SESSIONS
// ============================================================================

// Start session
router.post(
  "/session/start",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, remoteDeviceId, protocol, qualityProfile, multiPathEnabled, predictiveEnabled } = req.body;
    const session = await bandwidthService.startSession(req.user!.id, deviceId, remoteDeviceId, {
      protocol,
      qualityProfile,
      multiPathEnabled,
      predictiveEnabled,
    });
    res.status(201).json({ success: true, data: session });
  })
);

// Record session metrics
router.post(
  "/session/:sessionId/metrics",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { sessionId } = req.params;
    const metric = await bandwidthService.recordMetrics(sessionId, req.body);
    res.status(201).json({ success: true, data: metric });
  })
);

// End session
router.post(
  "/session/:sessionId/end",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { sessionId } = req.params;
    const session = await bandwidthService.endSession(sessionId);
    res.json({ success: true, data: session });
  })
);

// Get session history
router.get(
  "/sessions",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { limit } = req.query;
    const sessions = await bandwidthService.getSessionHistory(
      req.user!.id,
      parseInt(limit as string) || 20
    );
    res.json({ success: true, data: sessions });
  })
);

// Get session metrics
router.get(
  "/session/:sessionId/metrics",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { sessionId } = req.params;
    const { limit } = req.query;
    const metrics = await bandwidthService.getSessionMetrics(
      sessionId,
      parseInt(limit as string) || 100
    );
    res.json({ success: true, data: metrics });
  })
);

export default router;
