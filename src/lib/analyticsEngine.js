// src/lib/analyticsEngine.js
// AnalyticsEngine — metrics, trends, platform breakdowns, success rates

class AnalyticsEngine {
  constructor() {
    this._events = [];
  }

  // ─── Event Tracking ──────────────────────────────────────────────────────────

  /**
   * track(event, data) — record an analytics event.
   * event: string name, data: arbitrary metadata
   */
  track(event, data = {}) {
    this._events.push({
      id: `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      event,
      data,
      timestamp: Date.now(),
    });
    // Cap memory at 5000 events
    if (this._events.length > 5000) this._events.shift();
  }

  // ─── Core Metrics ─────────────────────────────────────────────────────────────

  /**
   * getMetrics(dateRange?) — returns aggregate metrics.
   * dateRange: { from: Date|number, to: Date|number }
   */
  getMetrics(dateRange) {
    const events = this._filterByDateRange(this._events, dateRange);
    const byEvent = {};
    events.forEach((e) => {
      byEvent[e.event] = (byEvent[e.event] || 0) + 1;
    });
    return {
      totalEvents: events.length,
      byEvent,
      dateRange: dateRange || { from: null, to: null },
      generatedAt: Date.now(),
    };
  }

  // ─── Broadcast Analytics ──────────────────────────────────────────────────────

  /**
   * getBroadcastStats(broadcasts) — aggregate stats from broadcast records.
   * broadcasts: array of { id, status, platform, sentAt, tokenCount, error? }
   */
  getBroadcastStats(broadcasts = []) {
    const total = broadcasts.length;
    const sent = broadcasts.filter((b) => b.status === 'sent' || b.status === 'done').length;
    const failed = broadcasts.filter((b) => b.status === 'failed' || b.status === 'error').length;
    const pending = broadcasts.filter((b) => b.status === 'pending' || b.status === 'queued').length;
    const totalTokens = broadcasts.reduce((sum, b) => sum + (b.tokenCount || 0), 0);
    const avgTokens = total > 0 ? Math.round(totalTokens / total) : 0;

    return { total, sent, failed, pending, totalTokens, avgTokens, successRate: total > 0 ? +(sent / total * 100).toFixed(1) : 0 };
  }

  /**
   * getPlatformBreakdown(accounts) — group accounts and broadcasts by platform.
   * accounts: array of { id, platform, broadcastCount?, successCount? }
   */
  getPlatformBreakdown(accounts = []) {
    const map = {};
    accounts.forEach((acc) => {
      const p = acc.platform || 'unknown';
      if (!map[p]) map[p] = { platform: p, accountCount: 0, broadcastCount: 0, successCount: 0 };
      map[p].accountCount++;
      map[p].broadcastCount += acc.broadcastCount || 0;
      map[p].successCount += acc.successCount || 0;
    });
    return Object.values(map).sort((a, b) => b.broadcastCount - a.broadcastCount);
  }

  /**
   * getTrend(data, days) — bucket broadcast/event data into daily counts.
   * data: array of { timestamp/sentAt/createdAt } items
   * Returns array of { date: 'YYYY-MM-DD', count: number } for last `days` days
   */
  getTrend(data = [], days = 7) {
    const now = Date.now();
    const buckets = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      buckets[this._dateKey(d)] = 0;
    }
    data.forEach((item) => {
      const ts = item.timestamp || item.sentAt || item.createdAt;
      if (!ts) return;
      const d = new Date(typeof ts === 'string' ? ts : ts);
      const key = this._dateKey(d);
      if (Object.prototype.hasOwnProperty.call(buckets, key)) {
        buckets[key]++;
      }
    });
    return Object.entries(buckets).map(([date, count]) => ({ date, count }));
  }

  /**
   * getSuccessRate(broadcasts) — returns 0-100 success percentage.
   */
  getSuccessRate(broadcasts = []) {
    if (!broadcasts.length) return 0;
    const success = broadcasts.filter((b) => b.status === 'sent' || b.status === 'done').length;
    return +(success / broadcasts.length * 100).toFixed(2);
  }

  /**
   * getTopPrompts(broadcasts, n) — returns n most-used prompts by frequency.
   * broadcasts: array of { promptId?, promptTitle?, templateId? }
   */
  getTopPrompts(broadcasts = [], n = 5) {
    const freq = {};
    broadcasts.forEach((b) => {
      const key = b.promptId || b.templateId || b.promptTitle || 'unknown';
      freq[key] = (freq[key] || 0) + 1;
    });
    return Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, n)
      .map(([id, count]) => ({ id, count }));
  }

  /**
   * getMostActiveAccount(broadcasts, accounts) — returns the account with most broadcasts.
   * broadcasts: [{ accountId }], accounts: [{ id, name, platform }]
   */
  getMostActiveAccount(broadcasts = [], accounts = []) {
    const freq = {};
    broadcasts.forEach((b) => {
      if (b.accountId) freq[b.accountId] = (freq[b.accountId] || 0) + 1;
    });
    const top = Object.entries(freq).sort(([, a], [, b]) => b - a)[0];
    if (!top) return null;
    const [accountId, count] = top;
    const account = accounts.find((a) => a.id === accountId) || { id: accountId };
    return { ...account, broadcastCount: count };
  }

  // ─── Internal ─────────────────────────────────────────────────────────────────

  _filterByDateRange(items, dateRange) {
    if (!dateRange) return items;
    const from = dateRange.from ? new Date(dateRange.from).getTime() : 0;
    const to = dateRange.to ? new Date(dateRange.to).getTime() : Infinity;
    return items.filter((item) => {
      const ts = item.timestamp || item.sentAt || item.createdAt || 0;
      const t = typeof ts === 'string' ? new Date(ts).getTime() : ts;
      return t >= from && t <= to;
    });
  }

  _dateKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}

const analyticsEngine = new AnalyticsEngine();
export default analyticsEngine;
export { AnalyticsEngine };
