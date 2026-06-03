// src/services/replit.js
// ReplitService — Replit platform integration
// Bolt Studio Pro

import { BaseService } from './base.js';

const REPL_TEMPLATES = ['node', 'python', 'react', 'nextjs', 'rust', 'go', 'cpp'];

let _replStore = [
  { id: 'repl_001', name: 'node-starter',    template: 'node',   owner: 'me', status: 'stopped',  forks: 12, deployUrl: null },
  { id: 'repl_002', name: 'react-dashboard', template: 'react',  owner: 'me', status: 'running',  forks: 5,  deployUrl: 'https://react-dashboard.repl.co' },
  { id: 'repl_003', name: 'python-ml',       template: 'python', owner: 'me', status: 'stopped',  forks: 3,  deployUrl: null },
];

let _outputStore = {};

export class ReplitService extends BaseService {
  constructor(credential) {
    super('Replit', {
      baseUrl: 'https://replit.com/api/v1',
      ...credential,
    });
  }

  // ─── Fork Repl ───────────────────────────────────────────────────────────────

  async forkRepl(template) {
    if (!template) {
      throw Object.assign(new Error('ReplitService: template is required'), { code: 'INVALID_INPUT' });
    }
    if (!REPL_TEMPLATES.includes(template)) {
      throw Object.assign(
        new Error(`ReplitService: unknown template "${template}". Valid: ${REPL_TEMPLATES.join(', ')}`),
        { code: 'INVALID_TEMPLATE' }
      );
    }

    const repl = {
      id:         `repl_${Date.now()}`,
      name:       `${template}-${Math.random().toString(36).slice(2, 7)}`,
      template,
      owner:      this.credential?.username || 'me',
      status:     'stopped',
      forks:      0,
      forkedFrom: `template/${template}`,
      createdAt:  new Date().toISOString(),
      url:        `https://replit.com/@me/${template}-${Date.now()}`,
      deployUrl:  null,
    };

    _replStore.push(repl);

    const res = await this.request('/repls/fork', {
      method: 'POST',
      body:   JSON.stringify({ template }),
      _mockData: { repl },
    });

    return res.data;
  }

  // ─── Run Repl ────────────────────────────────────────────────────────────────

  async runRepl(id) {
    if (!id) throw Object.assign(new Error('ReplitService: repl id required'), { code: 'INVALID_INPUT' });

    const repl = _replStore.find(r => r.id === id);
    if (!repl) throw Object.assign(new Error(`ReplitService: repl ${id} not found`), { code: 'NOT_FOUND' });

    repl.status = 'running';

    // Simulate output generation
    const lines = [
      `[${new Date().toISOString()}] Starting ${repl.template} environment...`,
      `[${new Date().toISOString()}] Installing dependencies...`,
      `[${new Date().toISOString()}] Build complete.`,
      `[${new Date().toISOString()}] Listening on port 3000`,
      `[${new Date().toISOString()}] Server running at https://${repl.name}.repl.co`,
    ];

    _outputStore[id] = {
      replId:    id,
      lines,
      startedAt: new Date().toISOString(),
      exitCode:  null,
      pid:       Math.floor(Math.random() * 10000) + 1000,
    };

    const res = await this.request(`/repls/${id}/run`, {
      method: 'POST',
      _mockData: { repl, output: _outputStore[id] },
    });

    return res.data;
  }

  // ─── Get Repls ───────────────────────────────────────────────────────────────

  async getRepls(filters = {}) {
    let repls = [..._replStore];

    if (filters.status)   repls = repls.filter(r => r.status === filters.status);
    if (filters.template) repls = repls.filter(r => r.template === filters.template);

    const res = await this.request('/repls', {
      _mockData: {
        repls,
        total:   repls.length,
        running: repls.filter(r => r.status === 'running').length,
      },
    });

    return res.data;
  }

  // ─── Get Output ──────────────────────────────────────────────────────────────

  async getOutput(replId) {
    if (!replId) throw Object.assign(new Error('ReplitService: replId required'), { code: 'INVALID_INPUT' });

    const output = _outputStore[replId] || {
      replId,
      lines:    ['No output recorded yet.'],
      startedAt: null,
      exitCode:  null,
      pid:       null,
    };

    const res = await this.request(`/repls/${replId}/output`, {
      _mockData: { output },
    });

    return res.data;
  }

  // ─── Deploy Repl ─────────────────────────────────────────────────────────────

  async deployRepl(id) {
    if (!id) throw Object.assign(new Error('ReplitService: repl id required'), { code: 'INVALID_INPUT' });

    const repl = _replStore.find(r => r.id === id);
    if (!repl) throw Object.assign(new Error(`ReplitService: repl ${id} not found`), { code: 'NOT_FOUND' });

    const deployUrl = `https://${repl.name}.repl.co`;
    repl.deployUrl  = deployUrl;
    repl.status     = 'deployed';

    const deployment = {
      id:          `deploy_${Date.now()}`,
      replId:      id,
      url:         deployUrl,
      status:      'deployed',
      deployedAt:  new Date().toISOString(),
      region:      'us-east-1',
      buildTimeMs: Math.floor(3000 + Math.random() * 7000),
    };

    const res = await this.request(`/repls/${id}/deploy`, {
      method: 'POST',
      _mockData: { deployment, repl },
    });

    return res.data;
  }
}
