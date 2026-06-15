import { describe, expect, it } from 'vitest';
import { defaultDesktopSettingsState, desktopSettingsReducer } from '../src/renderer/src/features/settings/settingsReducer.js';

describe('desktopSettingsReducer', () => {
  it('keeps remote input disabled by default and enables only by action', () => {
    expect(defaultDesktopSettingsState.remoteInputEnabled).toBe(false);
    const state = desktopSettingsReducer(defaultDesktopSettingsState, { type: 'set-remote-input', enabled: true });
    expect(state.remoteInputEnabled).toBe(true);
  });

  it('clamps max file bytes to a minimum', () => {
    const state = desktopSettingsReducer(defaultDesktopSettingsState, { type: 'set-max-file-bytes', bytes: 10 });
    expect(state.maxFileBytes).toBe(1024);
  });
});
