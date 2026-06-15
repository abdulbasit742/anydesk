import React, { useReducer } from 'react';
import { diagnosticsReducer, initialDiagnosticsState, latestDiagnostics } from '../../state/diagnosticsStore.js';
import { packetLossPercent, summarizeDiagnostics } from '../../services/webrtcDiagnostics.js';
import { StatsCard } from './StatsCard.js';
import { SessionTimeline } from './SessionTimeline.js';
import { SupportBundleButton } from './SupportBundleButton.js';

export function DiagnosticsPanel({ sessionId, deviceId }: { sessionId: string; deviceId: string }): JSX.Element {
  const [state, dispatch] = useReducer(diagnosticsReducer, initialDiagnosticsState);
  const latest = latestDiagnostics(state);
  const summary = latest ? summarizeDiagnostics(latest) : 'No WebRTC samples collected yet.';
  return (
    <aside className="rd-diagnostics-panel">
      <div className="rd-section-header">
        <h2>Diagnostics</h2>
        <button type="button" onClick={() => dispatch({ type: 'clear' })}>Clear</button>
      </div>
      <p className="rd-muted">{summary}</p>
      <div className="rd-stats-grid">
        <StatsCard label="RTT" value={latest?.rttMs != null ? `${latest.rttMs.toFixed(0)} ms` : 'n/a'} />
        <StatsCard label="Packet loss" value={latest ? `${packetLossPercent(latest).toFixed(1)}%` : 'n/a'} />
        <StatsCard label="ICE" value={latest?.candidatePairState ?? 'unknown'} detail={`${latest?.localCandidateType ?? 'n/a'} → ${latest?.remoteCandidateType ?? 'n/a'}`} />
        <StatsCard label="Samples" value={String(state.samples.length)} />
      </div>
      <SupportBundleButton sessionId={sessionId} deviceId={deviceId} diagnostics={state} />
      <SessionTimeline entries={state.timeline} />
    </aside>
  );
}
