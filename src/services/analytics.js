// analytics.js — usage analytics tracking service (local only)

import storage from './storage.js';

const KEY = 'analytics';

function getStore() { return storage.get(KEY, { events: [], sessions: [], pageViews: {} }); }
function setStore(data) { return storage.set(KEY, data); }

export const analytics = {
  trackEvent(name, props = {}) {
    const data = getStore();
    data.events.push({ name, props, ts: Date.now(), session: this._session() });
    if (data.events.length > 1000) data.events = data.events.slice(-1000);
    setStore(data);
  },

  trackPageView(page) {
    const data = getStore();
    data.pageViews[page] = (data.pageViews[page] || 0) + 1;
    setStore(data);
    this.trackEvent('page_view', { page });
  },

  trackBroadcast(accountCount, successCount) {
    this.trackEvent('broadcast', { accountCount, successCount, successRate: successCount / accountCount });
  },

  trackError(message, context = {}) {
    this.trackEvent('error', { message, ...context });
  },

  _session() {
    if (!this.__session) this.__session = Math.random().toString(36).slice(2);
    return this.__session;
  },

  getTopPages(n = 10) {
    const data = getStore();
    return Object.entries(data.pageViews).sort((a, b) => b[1] - a[1]).slice(0, n).map(([page, views]) => ({ page, views }));
  },

  getEvents(name, since) {
    const data = getStore();
    return data.events.filter(e => (!name || e.name === name) && (!since || e.ts >= since));
  },

  getSummary() {
    const data = getStore();
    const broadcasts = data.events.filter(e => e.name === 'broadcast');
    return {
      totalEvents: data.events.length,
      totalPageViews: Object.values(data.pageViews).reduce((s, v) => s + v, 0),
      broadcastCount: broadcasts.length,
      avgSuccessRate: broadcasts.length ? broadcasts.reduce((s, e) => s + (e.props.successRate || 0), 0) / broadcasts.length : 0,
      topPages: this.getTopPages(5),
    };
  },

  clear() { setStore({ events: [], sessions: [], pageViews: {} }); },
};

export default analytics;
