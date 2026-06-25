/**
 * Automation & Workflows API Routes
 */

import { Router } from 'express';
import { automationService } from './automation.service.js';

const router = Router();

// GET /api/automation/rules — List all rules
router.get('/rules', async (_req, res) => {
  const rules = await automationService.getRules();
  res.json(rules);
});

// POST /api/automation/rules — Create automation rule
router.post('/rules', async (req, res) => {
  const createdBy = (req as any).userId || 'system';
  const rule = await automationService.createRule({ ...req.body, createdBy });
  res.status(201).json(rule);
});

// GET /api/automation/rules/:id — Get rule
router.get('/rules/:id', async (req, res) => {
  const rule = await automationService.getRule(req.params.id);
  if (!rule) return res.status(404).json({ error: 'Rule not found' });
  res.json(rule);
});

// PUT /api/automation/rules/:id — Update rule
router.put('/rules/:id', async (req, res) => {
  const rule = await automationService.updateRule(req.params.id, req.body);
  if (!rule) return res.status(404).json({ error: 'Rule not found' });
  res.json(rule);
});

// DELETE /api/automation/rules/:id — Delete rule
router.delete('/rules/:id', async (req, res) => {
  const deleted = await automationService.deleteRule(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Rule not found' });
  res.status(204).send();
});

// POST /api/automation/rules/:id/toggle — Toggle rule enabled/disabled
router.post('/rules/:id/toggle', async (req, res) => {
  const rule = await automationService.toggleRule(req.params.id);
  if (!rule) return res.status(404).json({ error: 'Rule not found' });
  res.json(rule);
});

// POST /api/automation/rules/:id/execute — Manually execute rule
router.post('/rules/:id/execute', async (req, res) => {
  const log = await automationService.executeRule(req.params.id, req.body);
  res.json(log);
});

// GET /api/automation/logs — Execution logs
router.get('/logs', async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
  const logs = await automationService.getLogs(limit);
  res.json(logs);
});

// GET /api/automation/stats — Automation statistics
router.get('/stats', async (_req, res) => {
  const stats = await automationService.getStats();
  res.json(stats);
});

export default router;
