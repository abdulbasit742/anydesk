import React from 'react';

export function StatsCard({ label, value, detail }: { label: string; value: string; detail?: string }): JSX.Element {
  return <div className="rd-stats-card"><span>{label}</span><strong>{value}</strong>{detail ? <small>{detail}</small> : null}</div>;
}
