import type { ConnectionPhase, TimelineEntry } from '../../types/desktopPart2.js';

export interface SessionLifecycleState {
  phase: ConnectionPhase;
  connectedAt?: number;
  disconnectedAt?: number;
  timeline: TimelineEntry[];
}

export type SessionLifecycleAction =
  | { type: 'phase'; phase: ConnectionPhase; at?: number; detail?: string }
  | { type: 'timeline'; entry: TimelineEntry };

export const initialSessionLifecycleState: SessionLifecycleState = { phase: 'idle', timeline: [] };

export function sessionLifecycleReducer(state: SessionLifecycleState, action: SessionLifecycleAction): SessionLifecycleState {
  if (action.type === 'timeline') return { ...state, timeline: [action.entry, ...state.timeline].slice(0, 250) };
  const at = action.at ?? Date.now();
  const entry: TimelineEntry = {
    id: `life_${at}_${Math.random().toString(36).slice(2, 7)}`,
    at,
    level: action.phase === 'failed' ? 'error' : action.phase === 'connected' ? 'success' : 'info',
    title: `Session ${action.phase}`,
    detail: action.detail,
    category: 'session',
  };
  return {
    ...state,
    phase: action.phase,
    connectedAt: action.phase === 'connected' ? at : state.connectedAt,
    disconnectedAt: ['failed', 'closed'].includes(action.phase) ? at : state.disconnectedAt,
    timeline: [entry, ...state.timeline].slice(0, 250),
  };
}
