// cache.js — LRU in-memory cache with TTL

class Cache {
  constructor({ maxSize = 100, defaultTTL = 300000 } = {}) {
    this.maxSize    = maxSize;
    this.defaultTTL = defaultTTL;
    this._map       = new Map();
  }

  get(key) {
    const entry = this._map.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expires) { this._map.delete(key); return undefined; }
    // LRU: move to end
    this._map.delete(key);
    this._map.set(key, entry);
    return entry.value;
  }

  set(key, value, ttl = this.defaultTTL) {
    if (this._map.has(key)) this._map.delete(key);
    else if (this._map.size >= this.maxSize) this._map.delete(this._map.keys().next().value);
    this._map.set(key, { value, expires: Date.now() + ttl });
    return this;
  }

  has(key) { return this.get(key) !== undefined; }

  delete(key) { return this._map.delete(key); }

  clear() { this._map.clear(); }

  size() { return this._map.size; }

  keys() { return [...this._map.keys()]; }

  cleanup() {
    const now = Date.now();
    for (const [k, v] of this._map) { if (now > v.expires) this._map.delete(k); }
    return this;
  }

  getOrSet(key, fn, ttl = this.defaultTTL) {
    const cached = this.get(key);
    if (cached !== undefined) return cached;
    const value = fn();
    this.set(key, value, ttl);
    return value;
  }
}

export const cache = new Cache();
export default Cache;
