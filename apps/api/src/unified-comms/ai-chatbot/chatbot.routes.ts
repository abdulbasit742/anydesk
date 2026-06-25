/**
 * AI Chatbot API Routes
 */

import { Router } from 'express';
import { chatbotService } from './chatbot.service.js';

const router = Router();

// POST /api/chatbot/message — Process user message
router.post('/message', async (req, res) => {
  try {
    const { sessionId, contactId, message } = req.body;
    if (!message) return res.status(400).json({ error: 'message is required' });
    const result = await chatbotService.processMessage(
      sessionId || 'anonymous-session',
      contactId || 'anonymous',
      message
    );
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/chatbot/config — Get chatbot config
router.get('/config', async (_req, res) => {
  const config = await chatbotService.getConfig();
  res.json(config);
});

// PUT /api/chatbot/config — Update chatbot config
router.put('/config', async (req, res) => {
  const config = await chatbotService.updateConfig(req.body);
  res.json(config);
});

// GET /api/chatbot/intents — List intents
router.get('/intents', async (_req, res) => {
  const intents = await chatbotService.getIntents();
  res.json(intents);
});

// POST /api/chatbot/intents — Create intent
router.post('/intents', async (req, res) => {
  const intent = await chatbotService.createIntent(req.body);
  res.status(201).json(intent);
});

// PUT /api/chatbot/intents/:id — Update intent
router.put('/intents/:id', async (req, res) => {
  const intent = await chatbotService.updateIntent(req.params.id, req.body);
  if (!intent) return res.status(404).json({ error: 'Intent not found' });
  res.json(intent);
});

// DELETE /api/chatbot/intents/:id — Delete intent
router.delete('/intents/:id', async (req, res) => {
  const deleted = await chatbotService.deleteIntent(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Intent not found' });
  res.status(204).send();
});

// GET /api/chatbot/conversations — List bot conversations
router.get('/conversations', async (_req, res) => {
  const conversations = await chatbotService.getConversations();
  res.json(conversations);
});

// GET /api/chatbot/conversations/:id — Get bot conversation
router.get('/conversations/:id', async (req, res) => {
  const conversation = await chatbotService.getConversation(req.params.id);
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
  res.json(conversation);
});

// POST /api/chatbot/conversations/:id/resolve — Mark resolved
router.post('/conversations/:id/resolve', async (req, res) => {
  const conversation = await chatbotService.resolveConversation(req.params.id);
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
  res.json(conversation);
});

// GET /api/chatbot/analytics — Chatbot analytics
router.get('/analytics', async (_req, res) => {
  const analytics = await chatbotService.getAnalytics();
  res.json(analytics);
});

export default router;
