// src/services/manus.js
// ManusService — Manus AI agent platform integration
// Bolt Studio Pro

import { BaseService } from './base.js';

let _taskStore = [];


function makeTask(task, context = {}) {
  return {
    id:          `manus_task_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    task,
    context,
    status:      'pending',
    agentId:     `agent_${Math.floor(Math.random() * 5) + 1}`,
    createdAt:   new Date().toISOString(),
    startedAt:   null,
    completedAt: null,
    result:      null,
    error:       null,
    steps:       [],
  };
}

export class ManusService extends BaseService {
  constructor(credential) {
    super('Manus', {
      baseUrl: 'https://api.manus.im/v1',
      ...credential,
    });

    this._credits    = credential?.credits ?? 800;
    this._agentPool  = Array.from({ length: 5 }, (_, i) => ({
      id:     `agent_${i + 1}`,
      status: 'idle',
      busy:   false,
      tasks:  0,
    }));
  }

  // ─── Send Task ───────────────────────────────────────────────────────────────

  async sendTask(task, context = {}) {
    if (!task) throw Object.assign(new Error('ManusService: task description required'), { code: 'INVALID_INPUT' });

    const newTask = makeTask(task, context);
    _taskStore.push(newTask);

    // Simulate task progression asynchronously
    setTimeout(() => {
      newTask.status    = 'running';
      newTask.startedAt = new Date().toISOString();
      newTask.steps.push({ step: 1, action: 'Analysing task', ts: new Date().toISOString() });
    }, 300);

    setTimeout(() => {
      newTask.status      = 'completed';
      newTask.completedAt = new Date().toISOString();
      newTask.result      = {
        summary:  `Completed: ${task.slice(0, 80)}`,
        artifacts: [],
        tokensUsed: Math.ceil(task.length * 2.1),
      };
      newTask.steps.push({ step: 2, action: 'Executing plan',      ts: new Date().toISOString() });
      newTask.steps.push({ step: 3, action: 'Returning result',     ts: new Date().toISOString() });
      this._credits = Math.max(0, this._credits - Math.ceil(task.length * 0.15));
    }, 1500);

    const res = await this.request('/tasks', {
      method: 'POST',
      body:   JSON.stringify({ task, context }),
      _mockData: { task: newTask },
    });

    return res.data;
  }

  // ─── Get Tasks ───────────────────────────────────────────────────────────────

  async getTasks(filters = {}) {
    let tasks = [..._taskStore];

    if (filters.status) {
      tasks = tasks.filter(t => t.status === filters.status);
    }
    if (filters.agentId) {
      tasks = tasks.filter(t => t.agentId === filters.agentId);
    }

    const res = await this.request('/tasks', {
      _mockData: {
        tasks:  tasks.slice(0, 50),
        total:  tasks.length,
        page:   filters.page  || 1,
        limit:  filters.limit || 50,
      },
    });

    return res.data;
  }

  // ─── Agent Status ─────────────────────────────────────────────────────────────

  async getAgentStatus() {
    const agents = this._agentPool.map(a => ({
      ...a,
      busy:         Math.random() > 0.6,
      tasksQueued:  Math.floor(Math.random() * 4),
      uptimeHours:  parseFloat((Math.random() * 48).toFixed(1)),
    }));

    const res = await this.request('/agents/status', {
      _mockData: {
        agents,
        summary: {
          total:   agents.length,
          idle:    agents.filter(a => !a.busy).length,
          busy:    agents.filter(a =>  a.busy).length,
          queued:  agents.reduce((s, a) => s + a.tasksQueued, 0),
        },
      },
    });

    return res.data;
  }

  // ─── Cancel Task ─────────────────────────────────────────────────────────────

  async cancelTask(id) {
    if (!id) throw Object.assign(new Error('ManusService: task id required'), { code: 'INVALID_INPUT' });

    const task = _taskStore.find(t => t.id === id);
    if (!task) throw Object.assign(new Error(`ManusService: task ${id} not found`), { code: 'NOT_FOUND' });
    if (['completed', 'failed', 'cancelled'].includes(task.status)) {
      throw Object.assign(new Error(`ManusService: task ${id} already in terminal state (${task.status})`), {
        code: 'INVALID_STATE',
      });
    }

    task.status      = 'cancelled';
    task.completedAt = new Date().toISOString();

    const res = await this.request(`/tasks/${id}/cancel`, {
      method: 'POST',
      _mockData: { task, message: `Task ${id} cancelled successfully` },
    });

    return res.data;
  }

  // ─── Credits ─────────────────────────────────────────────────────────────────

  async getCredits() {
    const res = await this.request('/credits', {
      _mockData: {
        credits:     this._credits,
        limit:       1000,
        plan:        'team',
        percentUsed: Math.round(((1000 - this._credits) / 1000) * 100),
        resetAt:     new Date(Date.now() + 30 * 86_400_000).toISOString(),
      },
    });

    return res.data;
  }
}
