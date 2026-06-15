import React, { useReducer } from 'react';
import { ClipboardSettings } from './ClipboardSettings.js';
import { ConnectionSettings } from './ConnectionSettings.js';
import { DiagnosticsSettings } from './DiagnosticsSettings.js';
import { FileTransferSettings } from './FileTransferSettings.js';
import { InputSettings } from './InputSettings.js';
import { PerformanceSettings } from './PerformanceSettings.js';
import { SecuritySettings } from './SecuritySettings.js';
import { defaultDesktopSettingsState, desktopSettingsReducer } from './settingsReducer.js';

export function DesktopSettings(): JSX.Element {
  const [state, dispatch] = useReducer(desktopSettingsReducer, defaultDesktopSettingsState);
  return (
    <main className="rd-desktop-settings">
      <header>
        <h1>Desktop settings</h1>
        <p>Session-sensitive capabilities are disabled by default and must be explicitly enabled.</p>
      </header>
      <ConnectionSettings state={state} dispatch={dispatch} />
      <FileTransferSettings state={state} dispatch={dispatch} />
      <ClipboardSettings state={state} dispatch={dispatch} />
      <InputSettings state={state} dispatch={dispatch} />
      <SecuritySettings state={state} dispatch={dispatch} />
      <PerformanceSettings state={state} dispatch={dispatch} />
      <DiagnosticsSettings state={state} dispatch={dispatch} />
    </main>
  );
}
