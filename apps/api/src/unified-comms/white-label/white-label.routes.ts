/**
 * White-Label API Routes
 */

import { Router } from 'express';
import { whiteLabelService } from './white-label.service.js';

const router = Router();

// GET /api/white-label/config — Get white-label config
router.get('/config', async (req, res) => {
  const config = await whiteLabelService.getConfig(req.query.organizationId as string);
  res.json(config);
});

// PUT /api/white-label/config/:id — Update white-label config
router.put('/config/:id', async (req, res) => {
  const config = await whiteLabelService.updateConfig(req.params.id, req.body);
  if (!config) return res.status(404).json({ error: 'Config not found' });
  res.json(config);
});

// PUT /api/white-label/config/:id/template/:templateId — Update email template
router.put('/config/:id/template/:templateId', async (req, res) => {
  const template = await whiteLabelService.updateEmailTemplate(req.params.id, req.params.templateId, req.body);
  if (!template) return res.status(404).json({ error: 'Template not found' });
  res.json(template);
});

// POST /api/white-label/verify-domain — Verify custom domain
router.post('/verify-domain', async (req, res) => {
  const { domain } = req.body;
  if (!domain) return res.status(400).json({ error: 'domain is required' });
  const result = await whiteLabelService.verifyDomain(domain);
  res.json(result);
});

export default router;
