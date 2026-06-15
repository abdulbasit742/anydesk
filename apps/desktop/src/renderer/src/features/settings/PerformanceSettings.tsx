import React from 'react';
import type { DesktopSettingsAction, DesktopSettingsState } from './settingsReducer.js';

export function PerformanceSettings({ state, dispatch }: { state: DesktopSettingsState; dispatch: React.Dispatch<DesktopSettingsAction> }): JSX.Element {
  return (
    <section className="rd-settings-section">
      <h3>Performance settings</h3>
      <p className="rd-muted">Balanced mode is recommended for most remote sessions.</p>
      <select value={state.performanceMode} onChange={(event) => dispatch({ type: 'set-performance-mode', mode: event.currentTarget.value as DesktopSettingsState['performanceMode'] })}><option value="quality">Quality</option><option value="balanced">Balanced</option><option value="bandwidth-saver">Bandwidth saver</option></select>
    </section>
  );
}
