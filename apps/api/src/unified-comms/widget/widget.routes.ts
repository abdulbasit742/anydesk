/**
 * Live Chat Widget API Routes
 */

import { Router } from 'express';
import { widgetService } from './widget.service.js';

const router = Router();

// GET /api/chat/widgets — List widgets
router.get('/widgets', async (_req, res) => {
  const widgets = await widgetService.getWidgets();
  res.json(widgets);
});

// GET /api/chat/widgets/:id — Get widget config
router.get('/widgets/:id', async (req, res) => {
  const widget = await widgetService.getWidget(req.params.id);
  if (!widget) return res.status(404).json({ error: 'Widget not found' });
  res.json(widget);
});

// POST /api/chat/widgets — Create widget
router.post('/widgets', async (req, res) => {
  const widget = await widgetService.createWidget(req.body);
  res.status(201).json(widget);
});

// PUT /api/chat/widgets/:id — Update widget
router.put('/widgets/:id', async (req, res) => {
  const widget = await widgetService.updateWidget(req.params.id, req.body);
  if (!widget) return res.status(404).json({ error: 'Widget not found' });
  res.json(widget);
});

// POST /api/chat/widget — Initialize chat widget session (public endpoint)
router.post('/widget', async (req, res) => {
  const { widgetId, visitorName, visitorEmail, pageUrl, metadata } = req.body;
  const session = await widgetService.initializeSession(widgetId || 'widget-default', {
    visitorName,
    visitorEmail,
    pageUrl,
    metadata,
  });
  res.status(201).json(session);
});

// POST /api/chat/session/:id/message — Send message in widget session
router.post('/session/:id/message', async (req, res) => {
  const { senderId, senderType, content, contentType } = req.body;
  if (!content) return res.status(400).json({ error: 'content is required' });
  const message = await widgetService.sendWidgetMessage(req.params.id, {
    senderId: senderId || 'visitor',
    senderType: senderType || 'visitor',
    content,
    contentType,
  });
  if (!message) return res.status(404).json({ error: 'Session not found' });
  res.status(201).json(message);
});

// GET /api/chat/session/:id — Get session
router.get('/session/:id', async (req, res) => {
  const session = await widgetService.getSession(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

// POST /api/chat/session/:id/end — End session
router.post('/session/:id/end', async (req, res) => {
  const session = await widgetService.endSession(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

export default router;
