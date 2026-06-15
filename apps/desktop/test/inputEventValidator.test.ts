import { describe, expect, it } from 'vitest';
import { validateNormalizedInputEvent } from '../src/main/input/inputEventValidator.js';

describe('validateNormalizedInputEvent', () => {
  it('accepts normalized pointer events inside viewport', () => {
    expect(validateNormalizedInputEvent({ type: 'pointer.move', x: 10, y: 20, viewportWidth: 100, viewportHeight: 100, at: Date.now() }).ok).toBe(true);
  });

  it('rejects stale and out-of-bounds events', () => {
    expect(validateNormalizedInputEvent({ type: 'pointer.move', x: 120, y: 20, viewportWidth: 100, viewportHeight: 100, at: Date.now() }).ok).toBe(false);
    expect(validateNormalizedInputEvent({ type: 'keyboard.key', code: 'KeyA', key: 'launch-calc', action: 'down', at: Date.now() - 60_000 }).ok).toBe(false);
  });
});
