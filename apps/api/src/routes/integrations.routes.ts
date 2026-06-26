/**
 * Integration Routes — Exposes AI, notifications, security, payments, location, automation.
 */

import { Router, type Request, type Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { remoteDesk_AI } from '../integrations/ai/orchestrator.js';
import { createTelegramNotifier } from '../integrations/notifications/telegram.js';
import { runSecurityChecks, RateLimiter, isIPBlocked, unblockIP } from '../integrations/security/suspiciousActivity.js';
import { scheduler, AUTOMATION_TEMPLATES } from '../integrations/ai/automationEngine.js';
import { updateLocation, getLatestLocation, getAllLocations, addGeofence, getActiveGeofences, getLocationHistory } from '../integrations/location/deviceLocation.js';

const router = Router();
const rateLimiter = new RateLimiter(60, 60000); // 60 requests per minute

// ============ AI ROUTES ============

router.post('/ai/chat', requireAuth, async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const config = {
      apiKeys: {
        openai: process.env.OPENAI_API_KEY || '',
        claude: process.env.ANTHROPIC_API_KEY || '',
        groq: process.env.GROQ_API_KEY || '',
      },
      defaultModel: 'openai-mini',
      maxBudgetPerDay: 10,
      cacheEnabled: true,
      cacheTTLMs: 300000,
    };

    const response = await remoteDesk_AI.chat(config, messages);
    res.json({ data: response });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/ai/diagnose', requireAuth, async (req: Request, res: Response) => {
  try {
    const { systemInfo, description } = req.body;
    const config = {
      apiKeys: { openai: process.env.OPENAI_API_KEY || '', groq: process.env.GROQ_API_KEY || '' },
      defaultModel: 'openai-mini',
      maxBudgetPerDay: 10,
      cacheEnabled: true,
      cacheTTLMs: 300000,
    };

    const response = await remoteDesk_AI.diagnoseIssue(config, systemInfo || '', description || '');
    res.json({ data: response });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/ai/generate-script', requireAuth, async (req: Request, res: Response) => {
  try {
    const { task, os } = req.body;
    const config = {
      apiKeys: { openai: process.env.OPENAI_API_KEY || '', groq: process.env.GROQ_API_KEY || '' },
      defaultModel: 'openai-mini',
      maxBudgetPerDay: 10,
      cacheEnabled: true,
      cacheTTLMs: 300000,
    };

    const response = await remoteDesk_AI.generateScript(config, task, os || 'linux');
    res.json({ data: response });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/ai/analyze-security', requireAuth, async (req: Request, res: Response) => {
  try {
    const { event } = req.body;
    const config = {
      apiKeys: { openai: process.env.OPENAI_API_KEY || '', groq: process.env.GROQ_API_KEY || '' },
      defaultModel: 'openai-mini',
      maxBudgetPerDay: 10,
      cacheEnabled: true,
      cacheTTLMs: 300000,
    };

    const response = await remoteDesk_AI.analyzeSecurityEvent(config, event);
    res.json({ data: response });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ============ NOTIFICATION ROUTES ============

router.post('/notifications/telegram/test', requireAuth, async (req: Request, res: Response) => {
  const notifier = createTelegramNotifier();
  const result = await notifier.test();
  res.json({ data: result });
});

router.post('/notifications/telegram/send', requireAuth, async (req: Request, res: Response) => {
  const { title, message, severity, category } = req.body;
  const notifier = createTelegramNotifier();
  const result = await notifier.send({ title, message, severity: severity || 'info', category: category || 'system' });
  res.json({ data: result });
});

router.get('/notifications/telegram/status', requireAuth, (req: Request, res: Response) => {
  const notifier = createTelegramNotifier();
  res.json({ data: { configured: notifier.isConfigured } });
});

// ============ SECURITY ROUTES ============

router.post('/security/check', requireAuth, (req: Request, res: Response) => {
  const { userId, ip, country, lastCountry, minutesSinceLastConnection } = req.body;
  const flags = runSecurityChecks({ userId, ip, country, lastCountry, minutesSinceLastConnection });
  res.json({ data: { flags, blocked: isIPBlocked(ip) } });
});

router.post('/security/unblock-ip', requireAuth, (req: Request, res: Response) => {
  const { ip } = req.body;
  unblockIP(ip);
  res.json({ data: { unblocked: true, ip } });
});

router.get('/security/rate-limit/:key', requireAuth, (req: Request, res: Response) => {
  const remaining = rateLimiter.remaining(req.params.key);
  res.json({ data: { remaining, allowed: remaining > 0 } });
});

// ============ AUTOMATION ROUTES ============

router.get('/automation/templates', requireAuth, (req: Request, res: Response) => {
  res.json({ data: AUTOMATION_TEMPLATES });
});

router.get('/automation/tasks', requireAuth, (req: Request, res: Response) => {
  res.json({ data: scheduler.getTasks() });
});

router.post('/automation/tasks', requireAuth, (req: Request, res: Response) => {
  const task = req.body;
  task.id = task.id || `task_${Date.now()}`;
  task.lastRun = null;
  task.lastResult = null;
  scheduler.addTask(task);
  res.json({ data: task });
});

router.post('/automation/tasks/:id/execute', requireAuth, async (req: Request, res: Response) => {
  const result = await scheduler.executeTask(req.params.id);
  res.json({ data: result });
});

router.delete('/automation/tasks/:id', requireAuth, (req: Request, res: Response) => {
  scheduler.removeTask(req.params.id);
  res.json({ data: { deleted: true } });
});

router.patch('/automation/tasks/:id/enable', requireAuth, (req: Request, res: Response) => {
  scheduler.enableTask(req.params.id);
  res.json({ data: { enabled: true } });
});

router.patch('/automation/tasks/:id/disable', requireAuth, (req: Request, res: Response) => {
  scheduler.disableTask(req.params.id);
  res.json({ data: { disabled: true } });
});

// ============ LOCATION ROUTES ============

router.post('/location/update', requireAuth, async (req: Request, res: Response) => {
  const location = req.body;
  const events = await updateLocation(location);
  res.json({ data: { updated: true, geofenceEvents: events } });
});

router.get('/location/device/:deviceId', requireAuth, (req: Request, res: Response) => {
  const location = getLatestLocation(req.params.deviceId);
  res.json({ data: location });
});

router.get('/location/all', requireAuth, (req: Request, res: Response) => {
  res.json({ data: getAllLocations() });
});

router.get('/location/history/:deviceId', requireAuth, async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const history = await getLocationHistory(
    req.params.deviceId,
    new Date(startDate as string || Date.now() - 86400000),
    new Date(endDate as string || Date.now())
  );
  res.json({ data: history });
});

router.get('/location/geofences', requireAuth, (req: Request, res: Response) => {
  res.json({ data: getActiveGeofences() });
});

router.post('/location/geofences', requireAuth, (req: Request, res: Response) => {
  const fence = req.body;
  fence.id = fence.id || `fence_${Date.now()}`;
  addGeofence(fence);
  res.json({ data: fence });
});

export default router;
