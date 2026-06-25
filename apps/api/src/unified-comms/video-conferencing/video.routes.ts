/**
 * Video Conferencing API Routes
 */

import { Router } from 'express';
import { videoConferencingService } from './video.service.js';

const router = Router();

// POST /api/meetings — Create meeting
router.post('/', async (req, res) => {
  const hostId = (req as any).userId || req.body.hostId || 'system';
  const meeting = await videoConferencingService.createMeeting({ ...req.body, hostId });
  res.status(201).json(meeting);
});

// GET /api/meetings — List meetings
router.get('/', async (req, res) => {
  const meetings = await videoConferencingService.listMeetings(req.query.hostId as string);
  res.json(meetings);
});

// GET /api/meetings/:id — Get meeting
router.get('/:id', async (req, res) => {
  const meeting = await videoConferencingService.getMeeting(req.params.id);
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
  res.json(meeting);
});

// GET /api/meetings/code/:code — Get meeting by room code
router.get('/code/:code', async (req, res) => {
  const meeting = await videoConferencingService.getMeetingByCode(req.params.code);
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
  res.json(meeting);
});

// POST /api/meetings/:id/join — Join meeting
router.post('/:id/join', async (req, res) => {
  const userId = (req as any).userId || req.body.userId || 'guest';
  const participant = await videoConferencingService.joinMeeting(req.params.id, {
    userId,
    name: req.body.name || 'Guest',
    email: req.body.email,
  });
  if (!participant) return res.status(400).json({ error: 'Cannot join meeting (full or not found)' });
  res.json(participant);
});

// POST /api/meetings/:id/leave — Leave meeting
router.post('/:id/leave', async (req, res) => {
  const userId = (req as any).userId || req.body.userId;
  const success = await videoConferencingService.leaveMeeting(req.params.id, userId);
  if (!success) return res.status(404).json({ error: 'Meeting not found' });
  res.json({ success: true });
});

// POST /api/meetings/:id/end — End meeting
router.post('/:id/end', async (req, res) => {
  const meeting = await videoConferencingService.endMeeting(req.params.id);
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
  res.json(meeting);
});

// POST /api/meetings/:id/media — Toggle media
router.post('/:id/media', async (req, res) => {
  const userId = (req as any).userId || req.body.userId;
  const { media } = req.body;
  const participant = await videoConferencingService.toggleParticipantMedia(req.params.id, userId, media);
  if (!participant) return res.status(404).json({ error: 'Participant not found' });
  res.json(participant);
});

// POST /api/meetings/:id/chat — Send chat message
router.post('/:id/chat', async (req, res) => {
  const senderId = (req as any).userId || req.body.senderId || 'guest';
  const message = await videoConferencingService.sendChatMessage(req.params.id, senderId, req.body.senderName || 'Guest', req.body.content);
  if (!message) return res.status(400).json({ error: 'Chat disabled or meeting not found' });
  res.status(201).json(message);
});

// POST /api/meetings/:id/hand — Raise/lower hand
router.post('/:id/hand', async (req, res) => {
  const userId = (req as any).userId || req.body.userId;
  const success = await videoConferencingService.raiseHand(req.params.id, userId);
  if (!success) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

export default router;
