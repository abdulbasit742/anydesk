/**
 * Analytics & Reporting API Routes
 */

import { Router } from 'express';
import { analyticsService } from './analytics.service.js';

const router = Router();

// GET /api/analytics/overview — Support analytics overview
router.get('/overview', async (req, res) => {
  const metrics = await analyticsService.getOverview(req.query.dateFrom as string, req.query.dateTo as string);
  res.json(metrics);
});

// GET /api/analytics/agents — Agent performance leaderboard
router.get('/agents', async (_req, res) => {
  const performance = await analyticsService.getAgentPerformance();
  res.json(performance);
});

// GET /api/analytics/revenue — Revenue impact
router.get('/revenue', async (_req, res) => {
  const impact = await analyticsService.getRevenueImpact();
  res.json(impact);
});

// GET /api/analytics/channels — Channel breakdown
router.get('/channels', async (_req, res) => {
  const metrics = await analyticsService.getChannelMetrics();
  res.json(metrics);
});

// GET /api/analytics/sla — SLA metrics
router.get('/sla', async (_req, res) => {
  const metrics = await analyticsService.getSLAMetrics();
  res.json(metrics);
});

// GET /api/analytics/realtime — Real-time metrics
router.get('/realtime', async (_req, res) => {
  const metrics = await analyticsService.getRealTimeMetrics();
  res.json(metrics);
});

// Custom Reports
router.get('/reports', async (_req, res) => {
  const reports = await analyticsService.getReports();
  res.json(reports);
});

router.post('/reports', async (req, res) => {
  const createdBy = (req as any).userId || 'system';
  const report = await analyticsService.createReport({ ...req.body, createdBy });
  res.status(201).json(report);
});

router.get('/reports/:id', async (req, res) => {
  const report = await analyticsService.getReport(req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  res.json(report);
});

router.put('/reports/:id', async (req, res) => {
  const report = await analyticsService.updateReport(req.params.id, req.body);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  res.json(report);
});

router.delete('/reports/:id', async (req, res) => {
  const deleted = await analyticsService.deleteReport(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Report not found' });
  res.status(204).send();
});

export default router;
