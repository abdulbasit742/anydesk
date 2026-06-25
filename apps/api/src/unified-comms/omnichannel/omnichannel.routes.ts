/**
 * Omnichannel Inbox API Routes
 */

import { Router } from 'express';
import { omnichannelService } from './omnichannel.service.js';

const router = Router();

// GET /api/channels — List all channels
router.get('/channels', async (_req, res) => {
  try {
    const channels = await omnichannelService.getChannels();
    res.json(channels);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/channels — Create channel config
router.post('/channels', async (req, res) => {
  try {
    const channel = await omnichannelService.createChannel(req.body);
    res.status(201).json(channel);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/channels/:id — Update channel config
router.put('/channels/:id', async (req, res) => {
  try {
    const channel = await omnichannelService.updateChannel(req.params.id, req.body);
    if (!channel) return res.status(404).json({ error: 'Channel not found' });
    res.json(channel);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/conversations — List conversations
router.get('/conversations', async (req, res) => {
  try {
    const filter = {
      status: req.query.status as any,
      channel: req.query.channel as any,
      assigneeId: req.query.assigneeId as string,
    };
    const conversations = await omnichannelService.getConversations(filter);
    res.json(conversations);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/conversations/:id — Get conversation
router.get('/conversations/:id', async (req, res) => {
  try {
    const conversation = await omnichannelService.getConversation(req.params.id);
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    res.json(conversation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/conversations/:id/messages — Get messages
router.get('/conversations/:id/messages', async (req, res) => {
  try {
    const messages = await omnichannelService.getMessages(req.params.id);
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/conversations/:id/messages — Send message (agent reply)
router.post('/conversations/:id/messages', async (req, res) => {
  try {
    const agentId = (req as any).userId || 'agent-system';
    const message = await omnichannelService.sendMessage(agentId, {
      conversationId: req.params.id,
      content: req.body.content,
      contentType: req.body.contentType,
    });
    if (!message) return res.status(404).json({ error: 'Conversation not found' });
    res.status(201).json(message);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/conversations/:id/assign — Assign conversation
router.post('/conversations/:id/assign', async (req, res) => {
  try {
    const { agentId } = req.body;
    const conversation = await omnichannelService.assignConversation(req.params.id, agentId);
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    res.json(conversation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/conversations/:id/resolve — Resolve conversation
router.post('/conversations/:id/resolve', async (req, res) => {
  try {
    const conversation = await omnichannelService.resolveConversation(req.params.id);
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    res.json(conversation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/webhook/incoming — Webhook for incoming messages from all channels
router.post('/webhook/incoming', async (req, res) => {
  try {
    const result = await omnichannelService.handleIncomingMessage(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
