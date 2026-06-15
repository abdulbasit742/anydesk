export interface IdempotencyDecision<T> {
  status: 'created' | 'replayed' | 'conflict';
  key: string;
  value?: T;
  reason?: string;
}

export interface IdempotencyStore<T> {
  get(key: string): Promise<T | undefined>;
  set(key: string, value: T, ttlSeconds: number): Promise<void>;
}

export async function runIdempotent<T>(store: IdempotencyStore<T>, key: string, ttlSeconds: number, create: () => Promise<T>): Promise<IdempotencyDecision<T>> {
  if (!/^[A-Za-z0-9:_-]{8,160}$/.test(key)) return { status: 'conflict', key, reason: 'invalid-idempotency-key' };
  const existing = await store.get(key);
  if (existing !== undefined) return { status: 'replayed', key, value: existing };
  const value = await create();
  await store.set(key, value, ttlSeconds);
  return { status: 'created', key, value };
}
