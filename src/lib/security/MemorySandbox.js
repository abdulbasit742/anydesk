// MemorySandbox.js — Limits key residency lifetimes to memory context only
const store = new Map();
const timers = new Map();

const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes

export function sandboxStore(key, value, ttlMs = DEFAULT_TTL_MS) {
  store.set(key, { value, storedAt: Date.now() });
  clearTimeout(timers.get(key));
  timers.set(key, setTimeout(() => {
    store.delete(key);
    timers.delete(key);
  }, ttlMs));
}

export function sandboxGet(key) {
  const entry = store.get(key);
  if (!entry) return null;
  return entry.value;
}

export function sandboxDelete(key) {
  store.delete(key);
  clearTimeout(timers.get(key));
  timers.delete(key);
}

export function sandboxClear() {
  for (const timer of timers.values()) clearTimeout(timer);
  store.clear();
  timers.clear();
}

export function sandboxExtend(key, additionalMs = DEFAULT_TTL_MS) {
  const entry = store.get(key);
  if (!entry) return false;
  clearTimeout(timers.get(key));
  timers.set(key, setTimeout(() => {
    store.delete(key);
    timers.delete(key);
  }, additionalMs));
  return true;
}

export function sandboxStats() {
  return {
    activeKeys: store.size,
    keys: [...store.keys()],
    memoryEstimateBytes: [...store.values()].reduce((acc, v) => acc + JSON.stringify(v).length * 2, 0),
  };
}
