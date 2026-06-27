const cache = new Map<string, { value: any; expiresAt: number }>();
export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    const entry = cache.get(key);
    if (!entry) return null;
    if (entry.expiresAt < Date.now()) { cache.delete(key); return null; }
    return entry.value as T;
  },
  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    cache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  },
  async delete(key: string): Promise<void> { cache.delete(key); },
  async flush(): Promise<void> { cache.clear(); },
  async getOrSet<T>(key: string, factory: () => Promise<T>, ttlSeconds: number = 300): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;
    const value = await factory();
    await this.set(key, value, ttlSeconds);
    return value;
  },
  getStats(): { size: number; keys: string[] } { return { size: cache.size, keys: Array.from(cache.keys()) }; },
};
