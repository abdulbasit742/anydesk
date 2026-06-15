export type SessionPanelId = 'chat' | 'files' | 'clipboard' | 'diagnostics' | 'settings';

export interface DesktopSessionCapabilityState {
  dataChannelReady: boolean;
  fileTransferEnabled: boolean;
  clipboardSyncEnabled: boolean;
  diagnosticsEnabled: boolean;
  remoteInputEnabled: boolean;
}

export interface DesktopSessionIntegrationEvent {
  at: string;
  sessionId: string;
  type:
    | 'panel-opened'
    | 'file-transfer-requested'
    | 'clipboard-enabled'
    | 'clipboard-disabled'
    | 'support-bundle-exported'
    | 'reconnect-requested';
  panel?: SessionPanelId;
  meta?: Record<string, unknown>;
}

export function canUseFileTransfer(capabilities: DesktopSessionCapabilityState): boolean {
  return capabilities.dataChannelReady && capabilities.fileTransferEnabled;
}

export function canUseClipboardSync(capabilities: DesktopSessionCapabilityState): boolean {
  return capabilities.dataChannelReady && capabilities.clipboardSyncEnabled;
}
