import React from 'react';

export interface ClipboardPermissionToggleProps {
  enabled: boolean;
  onChange(enabled: boolean): void;
}

export function ClipboardPermissionToggle({ enabled, onChange }: ClipboardPermissionToggleProps): JSX.Element {
  return (
    <label className="rd-toggle-row">
      <input type="checkbox" checked={enabled} onChange={(event) => onChange(event.currentTarget.checked)} />
      <span>
        <strong>Enable text clipboard sync for this session</strong>
        <small>Disabled by default. RemoteDesk syncs text only and never keeps clipboard history.</small>
      </span>
    </label>
  );
}
