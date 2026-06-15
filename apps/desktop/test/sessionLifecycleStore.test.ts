import { describe, expect, it } from 'vitest';
import { initialSessionLifecycleState, sessionLifecycleReducer } from '../src/renderer/src/features/session/sessionLifecycleStore.js';

describe('sessionLifecycleReducer', () => {
  it('records connection phase and timeline entry', () => {
    const state = sessionLifecycleReducer(initialSessionLifecycleState, { type: 'phase', phase: 'connected', at: 123 });
    expect(state.phase).toBe('connected');
    expect(state.connectedAt).toBe(123);
    expect(state.timeline[0].title).toContain('connected');
  });
});
