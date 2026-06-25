/**
 * Agent Workspace API Routes
 */

import { Router } from 'express';
import { agentService } from './agent.service.js';

const router = Router();

// Agents
router.get('/', async (_req, res) => {
  const agents = await agentService.getAgents();
  res.json(agents);
});

router.get('/status', async (_req, res) => {
  const status = await agentService.getAgentStatus();
  res.json(status);
});

router.get('/workload', async (_req, res) => {
  const workload = await agentService.getWorkloadBalance();
  res.json(workload);
});

router.get('/:id', async (req, res) => {
  const agent = await agentService.getAgent(req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  res.json(agent);
});

router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'status is required' });
  const agent = await agentService.updateAgentStatus(req.params.id, status);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  res.json(agent);
});

// Teams
router.get('/teams/list', async (_req, res) => {
  const teams = await agentService.getTeams();
  res.json(teams);
});

router.post('/teams', async (req, res) => {
  const team = await agentService.createTeam(req.body);
  res.status(201).json(team);
});

router.put('/teams/:id', async (req, res) => {
  const team = await agentService.updateTeam(req.params.id, req.body);
  if (!team) return res.status(404).json({ error: 'Team not found' });
  res.json(team);
});

// Canned Responses
router.get('/canned-responses', async (req, res) => {
  const responses = await agentService.getCannedResponses(req.query.category as string);
  res.json(responses);
});

router.post('/canned-responses', async (req, res) => {
  const createdBy = (req as any).userId || 'system';
  const response = await agentService.createCannedResponse({ ...req.body, createdBy });
  res.status(201).json(response);
});

router.put('/canned-responses/:id', async (req, res) => {
  const response = await agentService.updateCannedResponse(req.params.id, req.body);
  if (!response) return res.status(404).json({ error: 'Canned response not found' });
  res.json(response);
});

router.delete('/canned-responses/:id', async (req, res) => {
  const deleted = await agentService.deleteCannedResponse(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Canned response not found' });
  res.status(204).send();
});

// Macros
router.get('/macros', async (_req, res) => {
  const macrosList = await agentService.getMacros();
  res.json(macrosList);
});

router.post('/macros', async (req, res) => {
  const createdBy = (req as any).userId || 'system';
  const macro = await agentService.createMacro({ ...req.body, createdBy });
  res.status(201).json(macro);
});

router.post('/macros/:id/execute', async (req, res) => {
  const { ticketId } = req.body;
  const result = await agentService.executeMacro(req.params.id, ticketId);
  res.json(result);
});

// Schedules
router.get('/schedules', async (req, res) => {
  const schedules = await agentService.getSchedules(req.query.agentId as string);
  res.json(schedules);
});

router.post('/schedules', async (req, res) => {
  const schedule = await agentService.setSchedule(req.body);
  res.status(201).json(schedule);
});

export default router;
