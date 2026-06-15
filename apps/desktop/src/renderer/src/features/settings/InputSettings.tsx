import React from 'react';
import type { DesktopSettingsAction, DesktopSettingsState } from './settingsReducer.js';

export function InputSettings({ state, dispatch }: { state: DesktopSettingsState; dispatch: React.Dispatch<DesktopSettingsAction> }): JSX.Element {
  return (
    <section className="rd-settings-section">
      <h3>Remote input settings</h3>
      <p className="rd-muted">Native input execution is disabled unless reviewed platform executors are wired.</p>
      <label><input type="checkbox" checked={state.remoteInputEnabled} onChange={(event) => dispatch({ type: 'set-remote-input', enabled: event.currentTarget.checked })} /> Allow remote input for approved sessions</label>
    </section>
  );
}
