import React from 'react';
import type { ReconnectState } from '../../services/reconnectManager.js';

export function ReconnectBanner({ state, onRetry }: { state: ReconnectState; onRetry(): void }): JSX.Element | null {
  if (state.status === 'idle' || state.status === 'reconnected') return null;
  const message = state.status === 'failed'
    ? `Reconnect failed after ${state.attempts} attempts.`
    : state.status === 'scheduled'
      ? `Connection degraded. Reconnect attempt ${state.attempts + 1} scheduled.`
      : `Restarting ICE connection, attempt ${state.attempts}.`;
  return (
    <div className={state.status === 'failed' ? 'rd-banner rd-banner--danger' : 'rd-banner rd-banner--warning'}>
      <span>{message}</span>
      <button type="button" onClick={onRetry}>Retry now</button>
    </div>
  );
}
