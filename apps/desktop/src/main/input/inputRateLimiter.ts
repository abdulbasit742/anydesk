export class InputRateLimiter {
  private readonly maxEvents: number;
  private readonly windowMs: number;
  private buckets = new Map<string, number[]>();

  constructor(options: { maxEvents: number; windowMs: number } = { maxEvents: 120, windowMs: 1000 }) {
    this.maxEvents = options.maxEvents;
    this.windowMs = options.windowMs;
  }

  allow(sessionId: string, now = Date.now()): boolean {
    const bucket = (this.buckets.get(sessionId) ?? []).filter((time) => now - time < this.windowMs);
    if (bucket.length >= this.maxEvents) {
      this.buckets.set(sessionId, bucket);
      return false;
    }
    bucket.push(now);
    this.buckets.set(sessionId, bucket);
    return true;
  }

  reset(sessionId: string): void {
    this.buckets.delete(sessionId);
  }
}
