// CreditBroker.js — Deducts platform tokens and handles low-balance status switches
const LOW_BALANCE_THRESHOLD = 0.15;
const CRITICAL_THRESHOLD = 0.05;

export class CreditBroker {
  constructor(initialBalances = {}) {
    this.balances = { ...initialBalances };
    this.history = [];
    this.listeners = new Map();
  }

  getBalance(platformId) {
    return this.balances[platformId] || { used: 0, total: 1000, currency: 'tokens' };
  }

  deduct(platformId, amount, reason = '') {
    const current = this.getBalance(platformId);
    const remaining = current.total - current.used;

    if (amount > remaining) {
      const event = { type: 'insufficient', platformId, amount, remaining };
      this._emit('insufficient', event);
      return { success: false, reason: 'Insufficient balance', remaining };
    }

    current.used = (current.used || 0) + amount;
    this.balances[platformId] = current;

    const entry = { platformId, amount, reason, ts: Date.now(), balanceAfter: current.total - current.used };
    this.history.push(entry);

    const pct = (current.total - current.used) / current.total;
    if (pct <= CRITICAL_THRESHOLD) this._emit('critical', { platformId, remaining: current.total - current.used, pct });
    else if (pct <= LOW_BALANCE_THRESHOLD) this._emit('low', { platformId, remaining: current.total - current.used, pct });

    return { success: true, deducted: amount, remaining: current.total - current.used };
  }

  topUp(platformId, amount) {
    const current = this.getBalance(platformId);
    current.total = (current.total || 0) + amount;
    this.balances[platformId] = current;
    this._emit('topup', { platformId, amount, newTotal: current.total });
    return current;
  }

  getStatus(platformId) {
    const b = this.getBalance(platformId);
    const remaining = b.total - b.used;
    const pct = remaining / b.total;
    return {
      ...b, remaining, pct,
      status: pct <= CRITICAL_THRESHOLD ? 'critical' : pct <= LOW_BALANCE_THRESHOLD ? 'low' : 'ok',
    };
  }

  on(event, handler) { this.listeners.set(event, [...(this.listeners.get(event) || []), handler]); }
  _emit(event, data) { (this.listeners.get(event) || []).forEach(h => h(data)); }
  getHistory(platformId) { return platformId ? this.history.filter(h => h.platformId === platformId) : [...this.history]; }
}
