import React from 'react';
import type { ConnectionPhase } from '../../types/desktopPart2.js';

export function ConnectionStatusPill({ phase, latencyMs }: { phase: ConnectionPhase; latencyMs?: number | null }): JSX.Element {
  const label = latencyMs != null ? `${phase} · ${latencyMs.toFixed(0)}ms` : phase;
  return <span className={`rd-pill rd-connection-pill rd-connection-pill--${phase}`}>{label}</span>;
}
