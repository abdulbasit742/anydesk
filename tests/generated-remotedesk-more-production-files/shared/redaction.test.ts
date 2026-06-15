import { describe, expect, it } from 'vitest';
import { redactSupportText } from '../../../packages/shared/src/productionSprint/redaction.js';

describe('redactSupportText', () => {
  it('removes bearer tokens and masks IP addresses', () => {
    expect(redactSupportText('Bearer abc.def from 192.168.1.10')).toContain('[REDACTED_SECRET]');
    expect(redactSupportText('ip 192.168.1.10')).toContain('[REDACTED_IP]');
  });
});
