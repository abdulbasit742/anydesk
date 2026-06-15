import { describe, expect, it } from 'vitest';
import { buildSupportBundle } from '../src/renderer/src/services/supportBundle.js';
import { initialDiagnosticsState } from '../src/renderer/src/state/diagnosticsStore.js';

describe('support bundle redaction', () => {
  it('redacts token and clipboard-like fields', () => {
    const json = buildSupportBundle({ sessionId: 's1', deviceId: 'd1', diagnostics: initialDiagnosticsState, extra: { token: 'abc', clipboardContent: 'secret' } });
    expect(json).not.toContain('abc');
    expect(json).not.toContain('secret');
    expect(json).toContain('[redacted]');
  });
});
