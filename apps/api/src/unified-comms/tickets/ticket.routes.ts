/**
 * Ticket Management API Routes
 */

import { Router } from 'express';
import { ticketService } from './ticket.service.js';
import type { TicketFilter, CreateTicketDto, UpdateTicketDto, TicketReplyDto } from './ticket.types.js';

const router = Router();

// POST /api/tickets — Create ticket
router.post('/', async (req, res) => {
  try {
    const dto: CreateTicketDto = req.body;
    if (!dto.subject || !dto.description) {
      return res.status(400).json({ error: 'subject and description are required' });
    }
    const ticket = await ticketService.createTicket(dto);
    res.status(201).json(ticket);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tickets — List tickets (with filters)
router.get('/', async (req, res) => {
  try {
    const filter: TicketFilter = {
      status: req.query.status ? (req.query.status as string).split(',') as any : undefined,
      priority: req.query.priority ? (req.query.priority as string).split(',') as any : undefined,
      channel: req.query.channel ? (req.query.channel as string).split(',') as any : undefined,
      assigneeId: req.query.assigneeId as string,
      teamId: req.query.teamId as string,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      category: req.query.category as string,
      search: req.query.search as string,
      dateFrom: req.query.dateFrom as string,
      dateTo: req.query.dateTo as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 25,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };
    const result = await ticketService.listTickets(filter);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tickets/stats — Ticket statistics
router.get('/stats', async (_req, res) => {
  try {
    const stats = await ticketService.getStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tickets/:id — Get single ticket
router.get('/:id', async (req, res) => {
  try {
    const ticket = await ticketService.getTicket(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/tickets/:id — Update ticket
router.put('/:id', async (req, res) => {
  try {
    const dto: UpdateTicketDto = req.body;
    const ticket = await ticketService.updateTicket(req.params.id, dto);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tickets/:id/reply — Reply to ticket
router.post('/:id/reply', async (req, res) => {
  try {
    const dto: TicketReplyDto = req.body;
    if (!dto.body) return res.status(400).json({ error: 'body is required' });
    const authorId = (req as any).userId || 'system';
    const reply = await ticketService.replyToTicket(req.params.id, authorId, dto);
    if (!reply) return res.status(404).json({ error: 'Ticket not found' });
    res.status(201).json(reply);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tickets/:id/replies — Get ticket replies
router.get('/:id/replies', async (req, res) => {
  try {
    const replies = await ticketService.getTicketReplies(req.params.id);
    res.json(replies);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tickets/merge — Merge tickets
router.post('/merge', async (req, res) => {
  try {
    const { sourceTicketIds, targetTicketId } = req.body;
    if (!sourceTicketIds?.length || !targetTicketId) {
      return res.status(400).json({ error: 'sourceTicketIds and targetTicketId are required' });
    }
    const ticket = await ticketService.mergeTickets({ sourceTicketIds, targetTicketId });
    if (!ticket) return res.status(404).json({ error: 'Target ticket not found' });
    res.json(ticket);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tickets/:id/satisfaction — Submit satisfaction rating
router.post('/:id/satisfaction', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (rating === undefined || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'rating (1-5) is required' });
    }
    const ticket = await ticketService.submitSatisfaction(req.params.id, rating, comment);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tickets/:id/assign — Auto-assign ticket
router.post('/:id/assign', async (req, res) => {
  try {
    const { strategy, teamId } = req.body;
    const ticket = await ticketService.assignTicket(req.params.id, strategy || 'round_robin', teamId);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
