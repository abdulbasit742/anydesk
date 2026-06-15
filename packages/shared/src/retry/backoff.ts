import type { RetryBackoffOptions } from './retryTypes.js';

export const DEFAULT_RETRY_BACKOFF: RetryBackoffOptions = {
  baseDelayMs: 250,
  maxDelayMs: 8000,
  multiplier: 2,
  jitterRatio: 0.15,
};

export function calculateBackoffDelayMs(attempt: number, options: RetryBackoffOptions = DEFAULT_RETRY_BACKOFF, random: () => number = Math.random): number {
  const safeAttempt = Math.max(0, Math.floor(attempt));
  const raw = Math.min(options.maxDelayMs, options.baseDelayMs * options.multiplier ** safeAttempt);
  const jitter = raw * options.jitterRatio * (random() * 2 - 1);
  return Math.max(0, Math.round(raw + jitter));
}
