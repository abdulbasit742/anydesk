import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAuth as auth } from '../../middleware/auth.js';

const router = Router();

// --- Tickets ---
router.post('/tickets', auth, asyncHandler(async (req: any, res) => {
  const { subject, description, category, priority, channel, metadata } = req.body;
  const ticket = await prisma.ticket.create({
    data: {
      customerId: req.user.id,
      subject,
      status: 'open',
      priority: priority || 'medium',
      channel: channel || 'chat',
      metadata,
    },
  });
  
  // Create initial message if description is provided
  if (description) {
    await prisma.message.create({
      data: {
        ticketId: ticket.id,
        senderId: req.user.id,
        body: description,
      },
    });
  }
  
  res.status(201).json(ticket);
}));

router.get('/tickets', auth, asyncHandler(async (req: any, res) => {
  const { status, priority, channel } = req.query;
  const where: any = {};
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (channel) where.channel = channel;
  
  // Agents see all tickets, customers see only their own
  // For simplicity in this demo, we check if user is in 'support' role (mocked or from user record)
  // Assuming user plan/role check here
  if (req.user.plan === 'FREE') {
    where.customerId = req.user.id;
  }

  const tickets = await prisma.ticket.findMany({
    where,
    include: {
      customer: { select: { fullName: true, email: true } },
      assignee: { select: { fullName: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(tickets);
}));

router.get('/tickets/:id', auth, asyncHandler(async (req: any, res) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: req.params.id },
    include: {
      customer: { select: { fullName: true, email: true } },
      assignee: { select: { fullName: true, email: true } },
      messages: {
        include: { sender: { select: { fullName: true } } },
        orderBy: { createdAt: 'asc' },
      },
      attachments: true,
    },
  });
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  res.json(ticket);
}));

router.put('/tickets/:id', auth, asyncHandler(async (req: any, res) => {
  const { status, priority, assignedToId } = req.body;
  const ticket = await prisma.ticket.update({
    where: { id: req.params.id },
    data: { 
      status, 
      priority, 
      assignedToId,
      resolvedAt: status === 'resolved' ? new Date() : undefined,
    },
  });
  res.json(ticket);
}));

router.post('/tickets/:id/reply', auth, asyncHandler(async (req: any, res) => {
  const { body, isInternal, metadata } = req.body;
  const message = await prisma.message.create({
    data: {
      ticketId: req.params.id,
      senderId: req.user.id,
      body,
      isInternal: isInternal || false,
      metadata,
    },
  });
  
  // Update ticket updated_at
  await prisma.ticket.update({
    where: { id: req.params.id },
    data: { updatedAt: new Date() },
  });
  
  res.status(201).json(message);
}));

// --- Knowledge Base ---
router.get('/kb/articles', asyncHandler(async (req, res) => {
  const { category, language, search } = req.query;
  const where: any = { status: 'published' };
  if (category) where.category = category;
  if (language) where.language = language;
  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { content: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  const articles = await prisma.kBArticle.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  res.json(articles);
}));

router.post('/kb/articles', auth, asyncHandler(async (req: any, res) => {
  const { title, content, category, language, status } = req.body;
  const article = await prisma.kBArticle.create({
    data: {
      authorId: req.user.id,
      title,
      content,
      category,
      language: language || 'en',
      status: status || 'draft',
    },
  });
  res.status(201).json(article);
}));

// --- Analytics ---
router.get('/analytics/overview', auth, asyncHandler(async (req: any, res) => {
  // Basic analytics for the dashboard
  const totalTickets = await prisma.ticket.count();
  const openTickets = await prisma.ticket.count({ where: { status: 'open' } });
  const resolvedTickets = await prisma.ticket.count({ where: { status: 'resolved' } });
  
  const ticketsByChannel = await prisma.ticket.groupBy({
    by: ['channel'],
    _count: { id: true },
  });

  res.json({
    totalTickets,
    openTickets,
    resolvedTickets,
    ticketsByChannel,
  });
}));

// --- Automation ---
router.post('/automation/rules', auth, asyncHandler(async (req: any, res) => {
  const { name, trigger, conditions, actions } = req.body;
  const rule = await prisma.automationRule.create({
    data: {
      userId: req.user.id,
      name,
      trigger,
      conditions,
      actions,
    },
  });
  res.status(201).json(rule);
}));

// --- VoIP / Calls ---
router.post('/calls/initiate', auth, asyncHandler(async (req: any, res) => {
  // This would integrate with Twilio in a real app
  // For now, we just return a mock session
  res.json({
    callId: 'call_' + Math.random().toString(36).substr(2, 9),
    status: 'initiated',
    token: 'mock_twilio_token',
  });
}));

export default router;
