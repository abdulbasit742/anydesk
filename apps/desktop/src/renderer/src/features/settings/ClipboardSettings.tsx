import React from 'react';
import type { DesktopSettingsAction, DesktopSettingsState } from './settingsReducer.js';

export function ClipboardSettings({ state, dispatch }: { state: DesktopSettingsState; dispatch: React.Dispatch<DesktopSettingsAction> }): JSX.Element {
  return (
    <section className="rd-settings-section">
      <h3>Clipboard settings</h3>
      <p className="rd-muted">Text clipboard sync is disabled by default. HTML and file formats remain off.</p>
      <label><input type="checkbox" checked={state.clipboardSyncEnabled} onChange={(event) => dispatch({ type: 'set-clipboard', enabled: event.currentTarget.checked })} /> Enable text clipboard sync</label>
    </section>
  );
}
