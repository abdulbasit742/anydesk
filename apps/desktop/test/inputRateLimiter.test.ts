import { describe, expect, it } from 'vitest';
import { InputRateLimiter } from '../src/main/input/inputRateLimiter.js';

describe('InputRateLimiter', () => {
  it('blocks events above limit in the same window', () => {
    const limiter = new InputRateLimiter({ maxEvents: 2, windowMs: 1000 });
    expect(limiter.allow('s1', 1000)).toBe(true);
    expect(limiter.allow('s1', 1001)).toBe(true);
    expect(limiter.allow('s1', 1002)).toBe(false);
    expect(limiter.allow('s1', 2500)).toBe(true);
  });
});
