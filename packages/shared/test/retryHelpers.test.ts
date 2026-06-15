import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBackoffDelayMs, resetRetryState, recordRetryFailure, canRetry } from '../src/retry/index.js';

test('backoff is deterministic when jitter random source is fixed', () => {
  const delay = calculateBackoffDelayMs(2, { baseDelayMs: 100, maxDelayMs: 1000, multiplier: 2, jitterRatio: 0 }, () => 0.5);
  assert.equal(delay, 400);
});

test('retry budget stops after max attempts', () => {
  const state = recordRetryFailure(resetRetryState(1), 'failed once');
  assert.equal(canRetry(state), false);
});
