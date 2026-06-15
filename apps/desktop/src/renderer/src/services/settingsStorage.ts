import { defaultDesktopSettingsState, type DesktopSettingsState } from '../features/settings/settingsReducer.js';

const KEY = 'remotedesk.desktop.settings.v2';

export function loadDesktopSettings(): DesktopSettingsState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultDesktopSettingsState;
    return { ...defaultDesktopSettingsState, ...JSON.parse(raw) };
  } catch {
    return defaultDesktopSettingsState;
  }
}

export function saveDesktopSettings(settings: DesktopSettingsState): void {
  localStorage.setItem(KEY, JSON.stringify(settings));
}
