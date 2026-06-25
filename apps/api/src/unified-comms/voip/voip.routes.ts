/**
 * VoIP Phone System API Routes
 */

import { Router } from 'express';
import { voipService } from './voip.service.js';

const router = Router();

// Virtual Numbers
router.get('/numbers', async (_req, res) => {
  const numbers = await voipService.getNumbers();
  res.json(numbers);
});

router.post('/numbers', async (req, res) => {
  const { country, type } = req.body;
  const number = await voipService.provisionNumber(country || 'US', type || 'local');
  res.status(201).json(number);
});

// IVR Menus
router.get('/ivr', async (_req, res) => {
  const menus = await voipService.getIVRMenus();
  res.json(menus);
});

router.post('/ivr', async (req, res) => {
  const menu = await voipService.createIVRMenu(req.body);
  res.status(201).json(menu);
});

router.put('/ivr/:id', async (req, res) => {
  const menu = await voipService.updateIVRMenu(req.params.id, req.body);
  if (!menu) return res.status(404).json({ error: 'IVR menu not found' });
  res.json(menu);
});

// Call Queues
router.get('/queues', async (_req, res) => {
  const queues = await voipService.getQueues();
  res.json(queues);
});

router.post('/queues', async (req, res) => {
  const queue = await voipService.createQueue(req.body);
  res.status(201).json(queue);
});

router.put('/queues/:id', async (req, res) => {
  const queue = await voipService.updateQueue(req.params.id, req.body);
  if (!queue) return res.status(404).json({ error: 'Queue not found' });
  res.json(queue);
});

// Calls
router.post('/calls/initiate', async (req, res) => {
  const { from, to, agentId } = req.body;
  if (!from || !to) return res.status(400).json({ error: 'from and to are required' });
  const call = await voipService.initiateCall(from, to, agentId);
  res.status(201).json(call);
});

router.post('/calls/incoming', async (req, res) => {
  const { from, to } = req.body;
  const call = await voipService.handleIncomingCall(from, to);
  res.status(201).json(call);
});

router.get('/calls', async (req, res) => {
  const filter = {
    status: req.query.status as any,
    agentId: req.query.agentId as string,
    direction: req.query.direction as any,
  };
  const calls = await voipService.getCalls(filter);
  res.json(calls);
});

router.get('/calls/:id', async (req, res) => {
  const call = await voipService.getCall(req.params.id);
  if (!call) return res.status(404).json({ error: 'Call not found' });
  res.json(call);
});

router.post('/calls/:id/answer', async (req, res) => {
  const agentId = req.body.agentId || (req as any).userId || 'agent-system';
  const call = await voipService.answerCall(req.params.id, agentId);
  if (!call) return res.status(404).json({ error: 'Call not found' });
  res.json(call);
});

router.post('/calls/:id/hold', async (req, res) => {
  const call = await voipService.holdCall(req.params.id);
  if (!call) return res.status(404).json({ error: 'Call not found' });
  res.json(call);
});

router.post('/calls/:id/transfer', async (req, res) => {
  const { targetAgentId } = req.body;
  if (!targetAgentId) return res.status(400).json({ error: 'targetAgentId is required' });
  const call = await voipService.transferCall(req.params.id, targetAgentId);
  if (!call) return res.status(404).json({ error: 'Call not found' });
  res.json(call);
});

router.post('/calls/:id/end', async (req, res) => {
  const call = await voipService.endCall(req.params.id);
  if (!call) return res.status(404).json({ error: 'Call not found' });
  res.json(call);
});

// Business Hours
router.get('/business-hours', async (_req, res) => {
  const hours = await voipService.getBusinessHours();
  res.json(hours);
});

router.post('/business-hours', async (req, res) => {
  const bh = await voipService.setBusinessHours(req.body);
  res.status(201).json(bh);
});

export default router;
