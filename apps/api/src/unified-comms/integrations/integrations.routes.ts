/**
 * Integrations API Routes
 */

import { Router } from 'express';
import { integrationsService } from './integrations.service.js';

const router = Router();

// Integrations
router.get('/', async (_req, res) => {
  const integrations = await integrationsService.getIntegrations();
  res.json(integrations);
});

router.get('/:id', async (req, res) => {
  const integration = await integrationsService.getIntegration(req.params.id);
  if (!integration) return res.status(404).json({ error: 'Integration not found' });
  res.json(integration);
});

router.post('/:id/connect', async (req, res) => {
  const integration = await integrationsService.connectIntegration(req.params.id, req.body.config || {});
  if (!integration) return res.status(404).json({ error: 'Integration not found' });
  res.json(integration);
});

router.post('/:id/disconnect', async (req, res) => {
  const integration = await integrationsService.disconnectIntegration(req.params.id);
  if (!integration) return res.status(404).json({ error: 'Integration not found' });
  res.json(integration);
});

router.put('/:id', async (req, res) => {
  const integration = await integrationsService.updateIntegration(req.params.id, req.body);
  if (!integration) return res.status(404).json({ error: 'Integration not found' });
  res.json(integration);
});

// Webhooks
router.get('/webhooks/list', async (_req, res) => {
  const webhooksList = await integrationsService.getWebhooks();
  res.json(webhooksList);
});

router.post('/webhooks', async (req, res) => {
  if (!req.body.name || !req.body.url || !req.body.events?.length) {
    return res.status(400).json({ error: 'name, url, and events are required' });
  }
  const webhook = await integrationsService.createWebhook(req.body);
  res.status(201).json(webhook);
});

router.put('/webhooks/:id', async (req, res) => {
  const webhook = await integrationsService.updateWebhook(req.params.id, req.body);
  if (!webhook) return res.status(404).json({ error: 'Webhook not found' });
  res.json(webhook);
});

router.delete('/webhooks/:id', async (req, res) => {
  const deleted = await integrationsService.deleteWebhook(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Webhook not found' });
  res.status(204).send();
});

router.post('/webhooks/:id/test', async (req, res) => {
  const log = await integrationsService.triggerWebhook(req.params.id, 'test', { message: 'Test webhook trigger' });
  res.json(log);
});

router.get('/webhooks/:id/logs', async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
  const logs = await integrationsService.getWebhookLogs(req.params.id, limit);
  res.json(logs);
});

export default router;
