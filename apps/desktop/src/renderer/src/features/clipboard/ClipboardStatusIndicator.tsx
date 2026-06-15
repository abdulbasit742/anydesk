import React from 'react';

export function ClipboardStatusIndicator({ enabled, lastRemoteSyncAt }: { enabled: boolean; lastRemoteSyncAt: number | null }): JSX.Element {
  const text = !enabled ? 'Clipboard sync off' : lastRemoteSyncAt ? `Last remote clipboard sync ${new Date(lastRemoteSyncAt).toLocaleTimeString()}` : 'Clipboard sync on';
  return <span className={enabled ? 'rd-pill rd-pill--ok' : 'rd-pill'}>{text}</span>;
}
