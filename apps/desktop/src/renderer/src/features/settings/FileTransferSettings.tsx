import React from 'react';
import type { DesktopSettingsAction, DesktopSettingsState } from './settingsReducer.js';

export function FileTransferSettings({ state, dispatch }: { state: DesktopSettingsState; dispatch: React.Dispatch<DesktopSettingsAction> }): JSX.Element {
  return (
    <section className="rd-settings-section">
      <h3>File transfer settings</h3>
      <p className="rd-muted">File transfer is disabled by default and requires receiver confirmation.</p>
      <><label><input type="checkbox" checked={state.fileTransferEnabled} onChange={(event) => dispatch({ type: 'set-file-transfer', enabled: event.currentTarget.checked })} /> Enable file transfer</label><label>Max file bytes <input type="number" value={state.maxFileBytes} onChange={(event) => dispatch({ type: 'set-max-file-bytes', bytes: Number(event.currentTarget.value) })} /></label></>
    </section>
  );
}
