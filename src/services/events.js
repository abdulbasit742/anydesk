// events.js — typed event bus for app-level communication

class EventBus {
  constructor() { this._handlers = new Map(); }

  on(event, handler) {
    if (!this._handlers.has(event)) this._handlers.set(event, new Set());
    this._handlers.get(event).add(handler);
    return () => this.off(event, handler);
  }

  once(event, handler) {
    const wrapped = (...args) => { handler(...args); this.off(event, wrapped); };
    return this.on(event, wrapped);
  }

  off(event, handler) {
    if (!event) { this._handlers.clear(); return; }
    if (!handler) { this._handlers.delete(event); return; }
    this._handlers.get(event)?.delete(handler);
  }

  emit(event, payload) {
    this._handlers.get(event)?.forEach(h => { try { h(payload); } catch(e) { console.error('EventBus:', e); } });
    this._handlers.get('*')?.forEach(h => { try { h({ event, payload }); } catch(e) { console.error('EventBus wildcard:', e); } });
  }

  listenerCount(event) { return this._handlers.get(event)?.size || 0; }
  events() { return [...this._handlers.keys()]; }
}

export const events = new EventBus();

// Typed event constants
export const EVENTS = {
  BROADCAST_START:   'broadcast:start',
  BROADCAST_SUCCESS: 'broadcast:success',
  BROADCAST_FAILURE: 'broadcast:failure',
  BROADCAST_END:     'broadcast:end',
  ACCOUNT_ADDED:     'account:added',
  ACCOUNT_UPDATED:   'account:updated',
  ACCOUNT_DELETED:   'account:deleted',
  CREDITS_LOW:       'credits:low',
  HEALTH_CHECK:      'health:check',
  HEALTH_RESULT:     'health:result',
  NAV_CHANGE:        'nav:change',
  THEME_CHANGE:      'theme:change',
  SETTINGS_CHANGE:   'settings:change',
};

export default events;
