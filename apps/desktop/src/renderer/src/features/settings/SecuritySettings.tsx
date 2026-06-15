import React from 'react';
import type { DesktopSettingsAction, DesktopSettingsState } from './settingsReducer.js';

export function SecuritySettings({ state, dispatch }: { state: DesktopSettingsState; dispatch: React.Dispatch<DesktopSettingsAction> }): JSX.Element {
  return (
    <section className="rd-settings-section">
      <h3>Security settings</h3>
      <p className="rd-muted">Emergency stop and explicit session permissions remain mandatory.</p>
      <p className="rd-warning">Unattended hidden control is not implemented by this pack.</p>
    </section>
  );
}
