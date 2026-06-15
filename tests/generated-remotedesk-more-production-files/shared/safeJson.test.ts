import { describe, expect, it } from 'vitest';
import { parseSafeJson, stringifyStable } from '../../../packages/shared/src/productionSprint/safeJson.js';

describe('safeJson', () => {
  it('returns a structured error instead of throwing', () => { expect(parseSafeJson('{bad').ok).toBe(false); });
  it('stable stringifies object keys', () => { expect(stringifyStable({ b: 1, a: 2 })).toBe('{"a":2,"b":1}'); });
});
