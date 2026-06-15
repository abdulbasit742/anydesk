import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RemoteDeskDataChannelLike } from '../../types/desktopPart2.js';
import type { DesktopAuditEmitter } from '../../services/auditEmitter.js';
import { ClipboardChannel } from '../../services/clipboardChannel.js';
import { DEFAULT_CLIPBOARD_SYNC_SETTINGS, looksLikeSecret, type ClipboardSyncSettings } from './clipboardSettings.js';

export interface UseClipboardSyncOptions {
  dataChannel?: RemoteDeskDataChannelLike;
  sessionId: string;
  audit?: DesktopAuditEmitter;
  settings?: ClipboardSyncSettings;
}

export function useClipboardSync(options: UseClipboardSyncOptions) {
  const [enabled, setEnabledState] = useState(options.settings?.enabled ?? false);
  const [lastRemoteSyncAt, setLastRemoteSyncAt] = useState<number | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const settings = options.settings ?? DEFAULT_CLIPBOARD_SYNC_SETTINGS;

  const channel = useMemo(() => {
    if (!options.dataChannel || !window.remoteDeskClipboard) return undefined;
    return new ClipboardChannel({
      dataChannel: options.dataChannel,
      sessionId: options.sessionId,
      readText: window.remoteDeskClipboard.readText,
      writeText: window.remoteDeskClipboard.writeText,
      debounceMs: settings.debounceMs,
      maxTextLength: settings.maxTextLength,
      onRemoteText: () => setLastRemoteSyncAt(Date.now()),
      onRejected: (reason) => setWarning(reason),
    });
  }, [options.dataChannel, options.sessionId, settings.debounceMs, settings.maxTextLength]);

  useEffect(() => () => channel?.dispose(), [channel]);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    channel?.setEnabled(next);
    void options.audit?.emit({ type: next ? 'clipboard.enabled' : 'clipboard.disabled', category: 'clipboard', metadata: { textOnly: true, htmlEnabled: false } });
  }, [channel, options.audit]);

  const sendCurrentClipboard = useCallback(async () => {
    if (!channel || !window.remoteDeskClipboard) return;
    const current = await window.remoteDeskClipboard.readText();
    if (settings.warnOnSecretLikeContent && looksLikeSecret(current.text)) {
      setWarning('Clipboard appears to contain a secret. RemoteDesk did not sync it automatically.');
      return;
    }
    channel.sendText(current.text);
    void options.audit?.emit({ type: 'clipboard.synced', category: 'clipboard', metadata: { textLength: current.text.length } });
  }, [channel, settings.warnOnSecretLikeContent, options.audit]);

  return { enabled, setEnabled, sendCurrentClipboard, lastRemoteSyncAt, warning, clearWarning: () => setWarning(null), settings };
}
