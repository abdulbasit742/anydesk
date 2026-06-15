import { describe, expect, it } from 'vitest';
import { looksLikeSecret } from '../src/renderer/src/features/clipboard/clipboardSettings.js';

describe('clipboard safety helpers', () => {
  it('detects obvious secret-like clipboard text', () => {
    expect(looksLikeSecret('password=super-secret')).toBe(true);
    expect(looksLikeSecret('Bearer abc.def.ghi')).toBe(true);
    expect(looksLikeSecret('meeting notes')).toBe(false);
  });
});
