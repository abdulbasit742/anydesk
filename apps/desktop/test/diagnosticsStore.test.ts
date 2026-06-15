import { describe, expect, it } from 'vitest';
import { diagnosticsReducer, initialDiagnosticsState, latestDiagnostics } from '../src/renderer/src/state/diagnosticsStore.js';

describe('diagnosticsStore', () => {
  it('stores latest samples and returns the latest one', () => {
    let state = diagnosticsReducer(initialDiagnosticsState, { type: 'sample', sample: { at: 1, rttMs: 10, packetsLost: 0, packetsReceived: 10, inboundBitrateBps: null, outboundBitrateBps: null } });
    state = diagnosticsReducer(state, { type: 'sample', sample: { at: 2, rttMs: 20, packetsLost: 1, packetsReceived: 20, inboundBitrateBps: null, outboundBitrateBps: null } });
    expect(latestDiagnostics(state)?.rttMs).toBe(20);
  });
});
