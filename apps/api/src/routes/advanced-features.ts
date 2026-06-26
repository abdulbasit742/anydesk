import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth as auth } from '../middleware/auth.js';

const router = Router();

// --- AI Sentiment Analysis & Auto-Translation (mocked) ---
router.post('/messages/:id/analyze-sentiment', auth, asyncHandler(async (req: any, res: any) => {
  const message = await prisma.message.findUnique({ where: { id: req.params.id } });
  if (!message) return res.status(404).json({ error: 'Message not found' });

  // Mock AI sentiment analysis
  const sentiment = Math.random() > 0.7 ? 'negative' : Math.random() > 0.5 ? 'neutral' : 'positive';
  const updatedMessage = await prisma.message.update({
    where: { id: req.params.id },
    data: { sentiment },
  });
  res.json(updatedMessage);
}));

router.post('/messages/:id/translate', auth, asyncHandler(async (req: any, res: any) => {
  const { targetLanguage } = req.body;
  const message = await prisma.message.findUnique({ where: { id: req.params.id } });
  if (!message) return res.status(404).json({ error: 'Message not found' });

  // Mock AI translation
  const translatedBody = `(Translated to ${targetLanguage}): ${message.body}`;
  const updatedMessage = await prisma.message.update({
    where: { id: req.params.id },
    data: { translatedBody },
  });
  res.json(updatedMessage);
}));

// --- Canned Responses with Macros ---
router.post('/canned-responses', auth, asyncHandler(async (req: any, res: any) => {
  const { title, content, macros } = req.body;
  const cannedResponse = await prisma.cannedResponse.create({
    data: {
      userId: req.user.id,
      title,
      content,
      macros,
    },
  });
  res.status(201).json(cannedResponse);
}));

router.get('/canned-responses', auth, asyncHandler(async (req: any, res: any) => {
  const cannedResponses = await prisma.cannedResponse.findMany({ where: { userId: req.user.id } });
  res.json(cannedResponses);
}));

// --- SLA Management (mocked updates) ---
router.put('/tickets/:id/sla', auth, asyncHandler(async (req: any, res: any) => {
  const { slaResponseAt, slaResolveAt } = req.body;
  const ticket = await prisma.ticket.update({
    where: { id: req.params.id },
    data: { slaResponseAt, slaResolveAt },
  });
  res.json(ticket);
}));

// --- Internal Team Channels ---
router.post('/team-channels', auth, asyncHandler(async (req: any, res: any) => {
  const { name, description } = req.body;
  const channel = await prisma.teamChannel.create({
    data: {
      name,
      description,
      creatorId: req.user.id,
      members: { create: { userId: req.user.id } }, // Creator is automatically a member
    },
  });
  res.status(201).json(channel);
}));

router.get('/team-channels', auth, asyncHandler(async (req: any, res: any) => {
  const channels = await prisma.teamChannel.findMany({
    where: { members: { some: { userId: req.user.id } } },
    include: { members: { include: { user: { select: { fullName: true } } } } },
  });
  res.json(channels);
}));

router.post('/team-channels/:id/join', auth, asyncHandler(async (req: any, res: any) => {
  const { userId } = req.body;
  const channelMember = await prisma.teamChannelMember.create({
    data: { channelId: req.params.id, userId },
  });
  res.status(201).json(channelMember);
}));

// --- IVR Visual Designer (mocked) ---
router.post('/ivr-flows', auth, asyncHandler(async (req: any, res: any) => {
  const { name, flowConfig } = req.body;
  const ivrFlow = await prisma.iVRFlow.create({
    data: {
      userId: req.user.id,
      name,
      flowConfig,
    },
  });
  res.status(201).json(ivrFlow);
}));

router.get('/ivr-flows', auth, asyncHandler(async (req: any, res: any) => {
  const ivrFlows = await prisma.iVRFlow.findMany({ where: { userId: req.user.id } });
  res.json(ivrFlows);
}));

// --- Screen Recording (mocked URL) ---
router.put('/sessions/:id/recording', auth, asyncHandler(async (req: any, res: any) => {
  const { recordingUrl } = req.body;
  const session = await prisma.session.update({
    where: { id: req.params.id },
    data: { recordingUrl },
  });
  res.json(session);
}));

// --- Agent Collision Detection (mocked) ---
router.post('/tickets/:id/viewing-agent', auth, asyncHandler(async (req: any, res: any) => {
  const { agentId } = req.body;
  // In a real scenario, this would involve a real-time presence system (e.g., Redis)
  // For now, we'll just update a field.
  const ticket = await prisma.ticket.update({
    where: { id: req.params.id },
    data: { viewingAgentId: agentId },
  });
  res.json(ticket);
}));

export default router;
