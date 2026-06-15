import React from 'react';
import type { DesktopSettingsAction, DesktopSettingsState } from './settingsReducer.js';

export function DiagnosticsSettings({ state, dispatch }: { state: DesktopSettingsState; dispatch: React.Dispatch<DesktopSettingsAction> }): JSX.Element {
  return (
    <section className="rd-settings-section">
      <h3>Diagnostics settings</h3>
      <p className="rd-muted">Diagnostics collect connection quality metadata, not clipboard contents.</p>
      <label><input type="checkbox" checked={state.diagnosticsEnabled} onChange={(event) => dispatch({ type: 'set-diagnostics', enabled: event.currentTarget.checked })} /> Enable diagnostics capture</label>
    </section>
  );
}
