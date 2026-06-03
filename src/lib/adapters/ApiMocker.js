// ApiMocker.js — Core router serving mock data when platform calls run in offline/demo mode
import { BoltAdapter } from './BoltAdapter.js';
import { LovableAdapter } from './LovableAdapter.js';
import { ManusAdapter } from './ManusAdapter.js';
import { ReplitAdapter } from './ReplitAdapter.js';
import { ClaudeAdapter } from './ClaudeAdapter.js';
import { CursorAdapter } from './CursorAdapter.js';
import { V0Adapter } from './V0Adapter.js';

const ADAPTERS = { bolt: BoltAdapter, lovable: LovableAdapter, manus: ManusAdapter, replit: ReplitAdapter, claude: ClaudeAdapter, cursor: CursorAdapter, v0: V0Adapter };

export class ApiMocker {
  constructor(options = {}) {
    this.offlineMode = options.offlineMode ?? true;
    this.instances = new Map();
    this.requestLog = [];
  }

  getAdapter(platform, credentials = {}) {
    const key = `${platform}_${credentials.id || 'default'}`;
    if (!this.instances.has(key)) {
      const AdapterClass = ADAPTERS[platform?.toLowerCase()];
      if (!AdapterClass) throw new Error(`Unknown platform: ${platform}`);
      this.instances.set(key, new AdapterClass(credentials));
    }
    return this.instances.get(key);
  }

  async sendPrompt(platform, prompt, credentials = {}, options = {}) {
    const startedAt = Date.now();
    try {
      const adapter = this.getAdapter(platform, credentials);
      const result = await adapter.sendPrompt(prompt, options);
      this._log({ platform, success: true, latency: Date.now() - startedAt });
      return result;
    } catch (err) {
      this._log({ platform, success: false, error: err.message, latency: Date.now() - startedAt });
      throw err;
    }
  }

  async broadcastToAll(accounts, prompt, options = {}) {
    const results = await Promise.allSettled(
      accounts.map(acc => this.sendPrompt(acc.platform, prompt, { apiKey: acc.apiKey, ...acc }, options))
    );
    return results.map((r, i) => ({
      accountId: accounts[i].id,
      platform: accounts[i].platform,
      ...(r.status === 'fulfilled' ? { success: true, data: r.value } : { success: false, error: r.reason?.message }),
    }));
  }

  _log(entry) {
    this.requestLog.push({ ...entry, ts: Date.now() });
    if (this.requestLog.length > 1000) this.requestLog.shift();
  }

  getStats() {
    const success = this.requestLog.filter(r => r.success).length;
    return { total: this.requestLog.length, success, failed: this.requestLog.length - success, avgLatency: this.requestLog.reduce((acc, r) => acc + r.latency, 0) / (this.requestLog.length || 1) };
  }

  clearInstances() { this.instances.clear(); }
  clearLog() { this.requestLog = []; }
}
