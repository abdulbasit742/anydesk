import type { TimelineEntry } from '../types/desktopPart2.js';
import type { WebRtcDiagnosticsSample } from '../services/webrtcDiagnostics.js';

export interface DiagnosticsState {
  samples: WebRtcDiagnosticsSample[];
  timeline: TimelineEntry[];
  maxSamples: number;
}

export type DiagnosticsAction =
  | { type: 'sample'; sample: WebRtcDiagnosticsSample }
  | { type: 'timeline'; entry: TimelineEntry }
  | { type: 'clear' };

export const initialDiagnosticsState: DiagnosticsState = { samples: [], timeline: [], maxSamples: 120 };

export function diagnosticsReducer(state: DiagnosticsState, action: DiagnosticsAction): DiagnosticsState {
  switch (action.type) {
    case 'sample':
      return { ...state, samples: [...state.samples, action.sample].slice(-state.maxSamples) };
    case 'timeline':
      return { ...state, timeline: [action.entry, ...state.timeline].slice(0, 250) };
    case 'clear':
      return { ...state, samples: [], timeline: [] };
    default:
      return state;
  }
}

export function latestDiagnostics(state: DiagnosticsState): WebRtcDiagnosticsSample | undefined {
  return state.samples[state.samples.length - 1];
}
