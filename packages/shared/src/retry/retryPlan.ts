import type { RetryBackoffOptions, RetryState } from './retryTypes.js';
import { calculateBackoffDelayMs } from './backoff.js';
import { canRetry } from './retryBudget.js';

export type RetryPlan = { readonly shouldRetry: true; readonly delayMs: number } | { readonly shouldRetry: false; readonly reason: string };

export function createRetryPlan(state: RetryState, options?: RetryBackoffOptions): RetryPlan {
  if (!canRetry(state)) return { shouldRetry: false, reason: 'retry budget exhausted' };
  return { shouldRetry: true, delayMs: calculateBackoffDelayMs(state.attempts, options) };
}
