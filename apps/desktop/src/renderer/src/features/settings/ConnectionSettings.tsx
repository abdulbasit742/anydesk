import React from 'react';
import type { DesktopSettingsAction, DesktopSettingsState } from './settingsReducer.js';

export function ConnectionSettings({ state, dispatch }: { state: DesktopSettingsState; dispatch: React.Dispatch<DesktopSettingsAction> }): JSX.Element {
  return (
    <section className="rd-settings-section">
      <h3>Connection settings</h3>
      <p className="rd-muted">Prefer TURN only when direct ICE candidates fail or policy requires relay.</p>
      <label><input type="checkbox" checked={state.preferTurn} onChange={(event) => dispatch({ type: 'set-prefer-turn', enabled: event.currentTarget.checked })} /> Prefer TURN relay when reconnecting</label>
    </section>
  );
}
