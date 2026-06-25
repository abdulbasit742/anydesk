/**
 * Remote Support API Routes
 */

import { Router } from 'express';
import { remoteSupportService } from './remote-support.service.js';

const router = Router();

// POST /api/remote-support/session — Start browser-based remote session
router.post('/session', async (req, res) => {
  const agentId = (req as any).userId || req.body.agentId || 'agent-system';
  const session = await remoteSupportService.createSession({ ...req.body, agentId });
  res.status(201).json(session);
});

// GET /api/remote-support/sessions — List sessions
router.get('/sessions', async (req, res) => {
  const filter = {
    agentId: req.query.agentId as string,
    status: req.query.status as any,
    ticketId: req.query.ticketId as string,
  };
  const sessions = await remoteSupportService.listSessions(filter);
  res.json(sessions);
});

// GET /api/remote-support/session/:id — Get session
router.get('/session/:id', async (req, res) => {
  const session = await remoteSupportService.getSession(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

// POST /api/remote-support/join/:code — Customer joins session
router.post('/join/:code', async (req, res) => {
  const session = await remoteSupportService.customerJoin(req.params.code);
  if (!session) return res.status(404).json({ error: 'Session not found or ended' });
  res.json(session);
});

// POST /api/remote-support/session/:id/control — Grant control
router.post('/session/:id/control', async (req, res) => {
  const session = await remoteSupportService.grantControl(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

// POST /api/remote-support/session/:id/revoke — Revoke control
router.post('/session/:id/revoke', async (req, res) => {
  const session = await remoteSupportService.revokeControl(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

// POST /api/remote-support/session/:id/end — End session
router.post('/session/:id/end', async (req, res) => {
  const session = await remoteSupportService.endSession(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

// POST /api/remote-support/session/:id/note — Add note
router.post('/session/:id/note', async (req, res) => {
  const { note } = req.body;
  if (!note) return res.status(400).json({ error: 'note is required' });
  const session = await remoteSupportService.addNote(req.params.id, note);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

export default router;
