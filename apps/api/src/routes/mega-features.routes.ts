import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { billingService } from "../services/billing.service.js";
import { aiSupportService } from "../services/ai-support.service.js";
import { securityService } from "../services/security.service.js";
import { gamingService } from "../services/gaming.service.js";
import { supportService } from "../services/support.service.js";
import { meshNetworkService } from "../services/mesh-network.service.js";

const router = Router();
router.use(requireAuth);

// ============================================================================
// FEATURE 1: SaaS MONETIZATION & BILLING
// ============================================================================

router.post(
  "/billing/checkout",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { plan } = req.body;
    const session = await billingService.createCheckoutSession(req.user!.id, plan);
    res.json({ success: true, data: session });
  })
);

router.get(
  "/billing/dashboard",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const dashboard = await billingService.getBillingDashboard(req.user!.id);
    res.json({ success: true, data: dashboard });
  })
);

router.post(
  "/billing/license/generate",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, expiresInDays } = req.body;
    const licenseKey = await billingService.generateLicenseKey(req.user!.id, deviceId, expiresInDays);
    res.json({ success: true, data: licenseKey });
  })
);

router.post(
  "/billing/license/validate",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { key } = req.body;
    const result = await billingService.validateLicenseKey(key);
    res.json({ success: result.valid, data: result });
  })
);

router.post(
  "/billing/license/activate",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { key, deviceId } = req.body;
    const licenseKey = await billingService.activateLicenseKey(key, deviceId);
    res.json({ success: true, data: licenseKey });
  })
);

router.post(
  "/billing/promo/apply",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { code } = req.body;
    const result = await billingService.applyPromoCode(code);
    res.json({ success: result.valid, data: result });
  })
);

router.get(
  "/billing/referrals",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const earnings = await billingService.getReferralEarnings(req.user!.id);
    res.json({ success: true, data: earnings });
  })
);

// ============================================================================
// FEATURE 2: AI-POWERED REMOTE IT SUPPORT
// ============================================================================

router.post(
  "/ai/diagnose",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, systemInfo } = req.body;
    const result = await aiSupportService.diagnoseSystem(req.user!.id, deviceId, systemInfo);
    res.json({ success: true, data: result });
  })
);

router.post(
  "/ai/execute-fix",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, fixScript } = req.body;
    const result = await aiSupportService.executeFix(req.user!.id, deviceId, fixScript);
    res.json({ success: true, data: result });
  })
);

router.post(
  "/ai/chat",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, message } = req.body;
    const result = await aiSupportService.chat(req.user!.id, deviceId, message);
    res.json({ success: true, data: result });
  })
);

router.get(
  "/ai/history",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId } = req.query;
    const history = await aiSupportService.getHistory(req.user!.id, deviceId as string);
    res.json({ success: true, data: history });
  })
);

router.post(
  "/ai/kb/add",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { title, issue, solution, scriptContent } = req.body;
    const kb = await aiSupportService.addKnowledgeBase(req.user!.id, title, issue, solution, scriptContent);
    res.json({ success: true, data: kb });
  })
);

router.get(
  "/ai/kb",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const kb = await aiSupportService.getKnowledgeBase(req.user!.id);
    res.json({ success: true, data: kb });
  })
);

router.put(
  "/ai/config",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const config = await aiSupportService.updateConfig(req.user!.id, req.body);
    res.json({ success: true, data: config });
  })
);

// ============================================================================
// FEATURE 3: CYBERSECURITY & ENDPOINT PROTECTION
// ============================================================================

router.post(
  "/security/event",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, eventType, severity, details } = req.body;
    const event = await securityService.recordSecurityEvent(req.user!.id, deviceId, eventType, severity, details);
    res.json({ success: true, data: event });
  })
);

router.post(
  "/security/vulnerability",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, cveId, severity, description, affectedSoftware } = req.body;
    const vuln = await securityService.recordVulnerability(
      req.user!.id,
      deviceId,
      cveId,
      severity,
      description,
      affectedSoftware
    );
    res.json({ success: true, data: vuln });
  })
);

router.get(
  "/security/dashboard",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const dashboard = await securityService.getSecurityDashboard(req.user!.id);
    res.json({ success: true, data: dashboard });
  })
);

router.post(
  "/security/policy",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { name, rules, assignedGroups } = req.body;
    const policy = await securityService.createPolicy(req.user!.id, name, rules, assignedGroups);
    res.json({ success: true, data: policy });
  })
);

router.get(
  "/security/compliance",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const compliance = await securityService.getComplianceStatus(req.user!.id);
    res.json({ success: true, data: compliance });
  })
);

// ============================================================================
// FEATURE 4: CLOUD GAMING & HIGH-PERFORMANCE STREAMING
// ============================================================================

router.post(
  "/gaming/session/start",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, gameTitle } = req.body;
    const session = await gamingService.startGamingSession(req.user!.id, deviceId, gameTitle);
    res.json({ success: true, data: session });
  })
);

router.post(
  "/gaming/session/:sessionId/end",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { sessionId } = req.params;
    const { metrics } = req.body;
    const session = await gamingService.endGamingSession(sessionId, metrics);
    res.json({ success: true, data: session });
  })
);

router.post(
  "/gaming/metrics",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { sessionId, metrics } = req.body;
    const metric = await gamingService.recordQualityMetric(sessionId, req.user!.id, metrics);
    res.json({ success: true, data: metric });
  })
);

router.get(
  "/gaming/analytics",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const analytics = await gamingService.getGamingAnalytics(req.user!.id);
    res.json({ success: true, data: analytics });
  })
);

router.post(
  "/gaming/library",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, gameName, installPath } = req.body;
    const game = await gamingService.addGameToLibrary(req.user!.id, deviceId, gameName, installPath);
    res.json({ success: true, data: game });
  })
);

// ============================================================================
// FEATURE 5: UNIFIED COMMUNICATIONS & CONTACT CENTER
// ============================================================================

router.post(
  "/support/ticket",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { subject, priority, channel } = req.body;
    const ticket = await supportService.createTicket(req.user!.id, subject, priority, channel);
    res.json({ success: true, data: ticket });
  })
);

router.post(
  "/support/ticket/:ticketId/message",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { ticketId } = req.params;
    const { body, isInternal, attachments } = req.body;
    const message = await supportService.addTicketMessage(ticketId, req.user!.id, body, isInternal, attachments);
    res.json({ success: true, data: message });
  })
);

router.get(
  "/support/tickets",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { status } = req.query;
    const tickets = await supportService.getUserTickets(req.user!.id, status as string);
    res.json({ success: true, data: tickets });
  })
);

router.get(
  "/support/dashboard",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const dashboard = await supportService.getSupportDashboard(req.user!.id);
    res.json({ success: true, data: dashboard });
  })
);

router.post(
  "/support/kb/article",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { title, body, category, tags } = req.body;
    const article = await supportService.createKBArticle(req.user!.id, title, body, category, tags);
    res.json({ success: true, data: article });
  })
);

router.get(
  "/support/kb/articles",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { category } = req.query;
    const articles = await supportService.getKBArticles(req.user!.id, category as string);
    res.json({ success: true, data: articles });
  })
);

router.post(
  "/support/csat",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { ticketId, score, comment } = req.body;
    const csat = await supportService.recordCSAT(ticketId, req.user!.id, score, comment);
    res.json({ success: true, data: csat });
  })
);

// ============================================================================
// FEATURE 6: MESH VPN & NETWORK INTELLIGENCE
// ============================================================================

router.post(
  "/mesh/node/register",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { deviceId, endpoint } = req.body;
    const node = await meshNetworkService.registerMeshNode(req.user!.id, deviceId, endpoint);
    res.json({ success: true, data: node });
  })
);

router.get(
  "/mesh/nodes",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const nodes = await meshNetworkService.getMeshNodes(req.user!.id);
    res.json({ success: true, data: nodes });
  })
);

router.post(
  "/mesh/network",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { name, description } = req.body;
    const network = await meshNetworkService.createMeshNetwork(req.user!.id, name, description);
    res.json({ success: true, data: network });
  })
);

router.get(
  "/mesh/networks",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const networks = await meshNetworkService.getMeshNetworks(req.user!.id);
    res.json({ success: true, data: networks });
  })
);

router.get(
  "/mesh/health",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const health = await meshNetworkService.getNetworkHealth(req.user!.id);
    res.json({ success: true, data: health });
  })
);

router.get(
  "/mesh/topology",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const topology = await meshNetworkService.getNetworkTopology(req.user!.id);
    res.json({ success: true, data: topology });
  })
);

router.post(
  "/mesh/metrics",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { nodeId, latencyMs, bandwidthMbps, packetLoss } = req.body;
    const metric = await meshNetworkService.recordNetworkMetric(
      req.user!.id,
      nodeId,
      latencyMs,
      bandwidthMbps,
      packetLoss
    );
    res.json({ success: true, data: metric });
  })
);

router.get(
  "/mesh/bandwidth-analytics",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const { days } = req.query;
    const analytics = await meshNetworkService.getBandwidthAnalytics(req.user!.id, parseInt(days as string) || 7);
    res.json({ success: true, data: analytics });
  })
);

export default router;
