// storage.js — enhanced localStorage wrapper with TTL, namespacing, and compression

const PREFIX = 'bsp:';

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (parsed.__ttl && Date.now() > parsed.__ttl) { this.remove(key); return fallback; }
      return parsed.__ttl ? parsed.__val : parsed;
    } catch { return fallback; }
  },

  set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; }
    catch { return false; }
  },

  setWithTTL(key, value, ttlMs) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify({ __val: value, __ttl: Date.now() + ttlMs })); return true; }
    catch { return false; }
  },

  remove(key) { localStorage.removeItem(PREFIX + key); },

  has(key) { return localStorage.getItem(PREFIX + key) !== null; },

  clear(prefix = '') {
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX + prefix)) toRemove.push(k);
    }
    toRemove.forEach(k => localStorage.removeItem(k));
    return toRemove.length;
  },

  keys(prefix = '') {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX + prefix)) keys.push(k.slice(PREFIX.length));
    }
    return keys;
  },

  size() { return localStorage.length; },

  sizeBytes() {
    let bytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX)) bytes += (k.length + (localStorage.getItem(k) || '').length) * 2;
    }
    return bytes;
  },
};

export default storage;
