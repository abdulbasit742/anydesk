export interface OfflineQueuePolicy {
  maxItems: number;
  maxAgeMs: number;
}

export function shouldRetainQueuedItem(createdAt: number, queueSize: number, policy: OfflineQueuePolicy, now = Date.now()): boolean {
  if (queueSize > policy.maxItems) return false;
  return now - createdAt <= policy.maxAgeMs;
}
