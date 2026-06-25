// CacheManager.js — Caches platform metadata and visual blueprints
const cache = new Map();
const TTL_MAP = new Map();

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export function set(key, value, ttl = DEFAULT_TTL) {
  cache.set(key, value);
  TTL_MAP.set(key, Date.now() + ttl);
}

export function get(key) {
  if (!cache.has(key)) return null;
  if (Date.now() > TTL_MAP.get(key)) {
    cache.delete(key);
    TTL_MAP.delete(key);
    return null;
  }
  return cache.get(key);
}

export function has(key) {
  return get(key) !== null;
}

export function invalidate(key) {
  cache.delete(key);
  TTL_MAP.delete(key);
}

export function invalidateByPrefix(prefix) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
      TTL_MAP.delete(key);
    }
  }
}

export function getOrFetch(key, fetchFn, ttl = DEFAULT_TTL) {
  const cached = get(key);
  if (cached !== null) return Promise.resolve(cached);
  return Promise.resolve(fetchFn()).then(value => {
    set(key, value, ttl);
    return value;
  });
}

export function clearAll() {
  cache.clear();
  TTL_MAP.clear();
}

export function getStats() {
  const now = Date.now();
  let expired = 0;
  let active = 0;
  for (const [key] of cache) {
    TTL_MAP.get(key) < now ? expired++ : active++;
  }
  return { total: cache.size, active, expired };
}
