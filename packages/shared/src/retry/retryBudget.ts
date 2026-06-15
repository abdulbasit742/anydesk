import type { RetryState } from './retryTypes.js';

export function canRetry(state: RetryState): boolean {
  return state.attempts < state.maxAttempts;
}

export function recordRetryFailure(state: RetryState, error: string): RetryState {
  return { ...state, attempts: state.attempts + 1, lastError: error };
}

export function resetRetryState(maxAttempts: number): RetryState {
  return { attempts: 0, maxAttempts };
}
