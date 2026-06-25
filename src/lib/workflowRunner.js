// src/lib/workflowRunner.js
// WorkflowRunner — step-by-step workflow execution with progress events

import { getAdapter } from './platformAdapter.js';

const STEP_TYPES = ['broadcast', 'wait', 'ping', 'check-credits', 'export'];

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

class WorkflowRunner {
  constructor() {
    this._status = 'idle'; // idle | running | paused | stopped | done | error
    this._stepIndex = 0;
    this._total = 0;
    this._log = [];
    this._pausePromise = null;
    this._pauseResolver = null;
    this._stopRequested = false;
    this._callbacks = {}; // event -> [fn]
  }

  // ─── EventEmitter ────────────────────────────────────────────────────────────

  on(event, fn) {
    if (!this._callbacks[event]) this._callbacks[event] = [];
    this._callbacks[event].push(fn);
    return this;
  }

  off(event, fn) {
    if (this._callbacks[event]) {
      this._callbacks[event] = this._callbacks[event].filter((f) => f !== fn);
    }
    return this;
  }

  _emit(event, ...args) {
    (this._callbacks[event] || []).forEach((fn) => {
      try { fn(...args); } catch { /* ignore */ }
    });
  }

  // ─── Controls ────────────────────────────────────────────────────────────────

  pause() {
    if (this._status !== 'running') return;
    this._status = 'paused';
    this._pausePromise = new Promise((res) => { this._pauseResolver = res; });
    this._emit('pause', this.getProgress());
  }

  resume() {
    if (this._status !== 'paused') return;
    this._status = 'running';
    if (this._pauseResolver) { this._pauseResolver(); this._pauseResolver = null; }
    this._emit('resume', this.getProgress());
  }

  stop() {
    this._stopRequested = true;
    if (this._status === 'paused' && this._pauseResolver) { this._pauseResolver(); }
    this._status = 'stopped';
    this._emit('stop', this.getProgress());
  }

  getProgress() {
    return {
      step: this._stepIndex,
      total: this._total,
      status: this._status,
      log: [...this._log],
      percent: this._total > 0 ? Math.round((this._stepIndex / this._total) * 100) : 0,
    };
  }

  // ─── Main Run ─────────────────────────────────────────────────────────────────

  /**
   * run(workflow, accounts) — execute a workflow against a set of accounts.
   * workflow: {
   *   id: string,
   *   name: string,
   *   steps: Array<{
   *     type: 'broadcast'|'wait'|'ping'|'check-credits'|'export',
   *     config: object,    // type-specific config
   *     onError?: 'stop'|'skip' (default 'skip')
   *   }>
   * }
   * accounts: Array<{ id, platform, credential }>
   * Returns final progress object.
   */
  async run(workflow, accounts = []) {
    if (this._status === 'running') throw new Error('WorkflowRunner already running');
    this._reset();
    this._total = workflow.steps.length;
    this._status = 'running';
    this._emit('start', { workflow, accounts, progress: this.getProgress() });

    for (let i = 0; i < workflow.steps.length; i++) {
      if (this._stopRequested) break;

      // Pause check
      if (this._status === 'paused' && this._pausePromise) {
        this._logEntry(i, 'paused', `Waiting at step ${i + 1}…`);
        await this._pausePromise;
        if (this._stopRequested) break;
        this._status = 'running';
      }

      this._stepIndex = i + 1;
      const step = workflow.steps[i];

      this._emit('step:start', { step, index: i, progress: this.getProgress() });

      try {
        const result = await this._executeStep(step, accounts, i);
        this._logEntry(i, 'success', result.message || `Step ${i + 1} complete`, result);
        this._emit('step:done', { step, index: i, result, progress: this.getProgress() });
      } catch (err) {
        const msg = err?.message || String(err);
        this._logEntry(i, 'error', msg);
        this._emit('step:error', { step, index: i, error: msg, progress: this.getProgress() });

        if (step.onError === 'stop') {
          this._status = 'error';
          this._emit('error', { step, index: i, error: msg, progress: this.getProgress() });
          return this.getProgress();
        }
        // default: skip and continue
      }
    }

    if (!this._stopRequested) {
      this._status = 'done';
      this._emit('done', this.getProgress());
    }

    return this.getProgress();
  }

  // ─── Step Executor ────────────────────────────────────────────────────────────

  async _executeStep(step, accounts, index) {
    const type = step.type;
    const cfg = step.config || {};

    switch (type) {
      case 'broadcast': {
        const prompt = cfg.prompt || '';
        if (!prompt) throw new Error('broadcast step requires config.prompt');
        const targets = accounts.filter((a) => !cfg.platforms || cfg.platforms.includes(a.platform));
        const results = [];
        for (const acc of targets) {
          const adapter = getAdapter(acc.platform, acc.credential);
          const res = await adapter.sendPrompt(prompt);
          results.push({ accountId: acc.id, ...res });
        }
        return { message: `Broadcast sent to ${results.length} account(s)`, results };
      }

      case 'wait': {
        const ms = (cfg.seconds || 5) * 1000;
        await delay(ms);
        return { message: `Waited ${cfg.seconds || 5}s` };
      }

      case 'ping': {
        const platform = cfg.platform || (accounts[0]?.platform);
        if (!platform) throw new Error('ping step requires config.platform or at least one account');
        const adapter = getAdapter(platform, null);
        const status = await adapter.getStatus();
        return { message: `Pinged ${platform}: ${status.status}`, ...status };
      }

      case 'check-credits': {
        const creditResults = [];
        for (const acc of accounts) {
          const adapter = getAdapter(acc.platform, acc.credential);
          const credits = await adapter.getCredits();
          if (cfg.minimumRemaining && credits.remaining < cfg.minimumRemaining) {
            throw new Error(`Account ${acc.id} has insufficient credits: ${credits.remaining} < ${cfg.minimumRemaining}`);
          }
          creditResults.push({ accountId: acc.id, ...credits });
        }
        return { message: `Credits checked for ${creditResults.length} account(s)`, results: creditResults };
      }

      case 'export': {
        const format = cfg.format || 'json';
        const payload = cfg.data || { step: index, timestamp: Date.now() };
        const content = format === 'csv'
          ? Object.keys(payload).join(',') + '\n' + Object.values(payload).join(',')
          : JSON.stringify(payload, null, 2);
        if (cfg.filename && typeof window !== 'undefined') {
          const blob = new Blob([content], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = cfg.filename; a.click();
          URL.revokeObjectURL(url);
        }
        return { message: `Exported as ${format}`, byteLength: content.length };
      }

      default:
        throw new Error(`Unknown step type: "${type}". Valid types: ${STEP_TYPES.join(', ')}`);
    }
  }

  _logEntry(stepIndex, status, message, data = null) {
    this._log.push({
      stepIndex,
      status,
      message,
      data,
      timestamp: Date.now(),
    });
  }

  _reset() {
    this._stepIndex = 0;
    this._total = 0;
    this._log = [];
    this._pausePromise = null;
    this._pauseResolver = null;
    this._stopRequested = false;
    this._status = 'idle';
  }
}

export default WorkflowRunner;
