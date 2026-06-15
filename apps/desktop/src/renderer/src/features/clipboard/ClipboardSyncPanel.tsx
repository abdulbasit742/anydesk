import React from 'react';
import type { RemoteDeskDataChannelLike } from '../../types/desktopPart2.js';
import type { DesktopAuditEmitter } from '../../services/auditEmitter.js';
import { ClipboardPermissionToggle } from './ClipboardPermissionToggle.js';
import { ClipboardStatusIndicator } from './ClipboardStatusIndicator.js';
import { useClipboardSync } from './useClipboardSync.js';

export interface ClipboardSyncPanelProps {
  dataChannel?: RemoteDeskDataChannelLike;
  sessionId: string;
  audit?: DesktopAuditEmitter;
}

export function ClipboardSyncPanel({ dataChannel, sessionId, audit }: ClipboardSyncPanelProps): JSX.Element {
  const clipboard = useClipboardSync({ dataChannel, sessionId, audit });
  return (
    <section className="rd-clipboard-panel">
      <div className="rd-section-header">
        <h2>Clipboard sync</h2>
        <ClipboardStatusIndicator enabled={clipboard.enabled} lastRemoteSyncAt={clipboard.lastRemoteSyncAt} />
      </div>
      <ClipboardPermissionToggle enabled={clipboard.enabled} onChange={clipboard.setEnabled} />
      <p className="rd-muted">Text-only clipboard sync is available after both sides enable it. HTML and file clipboard formats are intentionally disabled.</p>
      {clipboard.warning ? (
        <p className="rd-warning">
          {clipboard.warning} <button type="button" onClick={clipboard.clearWarning}>Dismiss</button>
        </p>
      ) : null}
      <button type="button" disabled={!clipboard.enabled} onClick={() => void clipboard.sendCurrentClipboard()}>
        Sync current clipboard now
      </button>
    </section>
  );
}
