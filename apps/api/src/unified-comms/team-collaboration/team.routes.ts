/**
 * Team Collaboration API Routes
 */

import { Router } from 'express';
import { teamCollaborationService } from './team.service.js';

const router = Router();

// Channels
router.get('/channels', async (req, res) => {
  const userId = (req as any).userId || req.query.userId as string;
  const channels = await teamCollaborationService.getChannels(userId);
  res.json(channels);
});

router.post('/channels', async (req, res) => {
  const createdBy = (req as any).userId || 'system';
  const channel = await teamCollaborationService.createChannel({ ...req.body, createdBy });
  res.status(201).json(channel);
});

// Messages
router.get('/channels/:id/messages', async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
  const messages = await teamCollaborationService.getMessages(req.params.id, limit);
  res.json(messages);
});

router.post('/channels/:id/messages', async (req, res) => {
  const senderId = (req as any).userId || req.body.senderId || 'system';
  const message = await teamCollaborationService.sendMessage(req.params.id, {
    senderId,
    senderName: req.body.senderName || 'System',
    content: req.body.content,
    threadId: req.body.threadId,
  });
  if (!message) return res.status(404).json({ error: 'Channel not found' });
  res.status(201).json(message);
});

// Reactions
router.post('/channels/:channelId/messages/:messageId/react', async (req, res) => {
  const userId = (req as any).userId || req.body.userId || 'system';
  const { emoji } = req.body;
  if (!emoji) return res.status(400).json({ error: 'emoji is required' });
  const success = await teamCollaborationService.addReaction(req.params.channelId, req.params.messageId, userId, emoji);
  if (!success) return res.status(404).json({ error: 'Message not found' });
  res.json({ success: true });
});

// Escalation Paths
router.get('/escalation-paths', async (_req, res) => {
  const paths = await teamCollaborationService.getEscalationPaths();
  res.json(paths);
});

router.post('/escalation-paths', async (req, res) => {
  const path = await teamCollaborationService.createEscalationPath(req.body);
  res.status(201).json(path);
});

// Shared Inboxes
router.get('/shared-inboxes', async (_req, res) => {
  const inboxes = await teamCollaborationService.getSharedInboxes();
  res.json(inboxes);
});

router.post('/shared-inboxes', async (req, res) => {
  const inbox = await teamCollaborationService.createSharedInbox(req.body);
  res.status(201).json(inbox);
});

export default router;
