export interface DesktopSettingsState {
  fileTransferEnabled: boolean;
  clipboardSyncEnabled: boolean;
  remoteInputEnabled: boolean;
  diagnosticsEnabled: boolean;
  preferTurn: boolean;
  maxFileBytes: number;
  performanceMode: 'quality' | 'balanced' | 'bandwidth-saver';
}

export type DesktopSettingsAction =
  | { type: 'set-file-transfer'; enabled: boolean }
  | { type: 'set-clipboard'; enabled: boolean }
  | { type: 'set-remote-input'; enabled: boolean }
  | { type: 'set-diagnostics'; enabled: boolean }
  | { type: 'set-prefer-turn'; enabled: boolean }
  | { type: 'set-max-file-bytes'; bytes: number }
  | { type: 'set-performance-mode'; mode: DesktopSettingsState['performanceMode'] };

export const defaultDesktopSettingsState: DesktopSettingsState = {
  fileTransferEnabled: false,
  clipboardSyncEnabled: false,
  remoteInputEnabled: false,
  diagnosticsEnabled: true,
  preferTurn: false,
  maxFileBytes: 1024 * 1024 * 1024,
  performanceMode: 'balanced',
};

export function desktopSettingsReducer(state: DesktopSettingsState, action: DesktopSettingsAction): DesktopSettingsState {
  switch (action.type) {
    case 'set-file-transfer': return { ...state, fileTransferEnabled: action.enabled };
    case 'set-clipboard': return { ...state, clipboardSyncEnabled: action.enabled };
    case 'set-remote-input': return { ...state, remoteInputEnabled: action.enabled };
    case 'set-diagnostics': return { ...state, diagnosticsEnabled: action.enabled };
    case 'set-prefer-turn': return { ...state, preferTurn: action.enabled };
    case 'set-max-file-bytes': return { ...state, maxFileBytes: Math.max(1024, action.bytes) };
    case 'set-performance-mode': return { ...state, performanceMode: action.mode };
    default: return state;
  }
}
