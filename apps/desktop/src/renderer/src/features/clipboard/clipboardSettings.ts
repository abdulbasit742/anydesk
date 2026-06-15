export interface ClipboardSyncSettings {
  enabled: boolean;
  textOnly: true;
  htmlEnabled: false;
  maxTextLength: number;
  debounceMs: number;
  warnOnSecretLikeContent: boolean;
}

export const DEFAULT_CLIPBOARD_SYNC_SETTINGS: ClipboardSyncSettings = {
  enabled: false,
  textOnly: true,
  htmlEnabled: false,
  maxTextLength: 64_000,
  debounceMs: 500,
  warnOnSecretLikeContent: true,
};

export function looksLikeSecret(text: string): boolean {
  const patterns = [/password\s*[:=]/i, /api[_-]?key\s*[:=]/i, /bearer\s+[a-z0-9._-]+/i, /-----BEGIN [A-Z ]+PRIVATE KEY-----/];
  return patterns.some((pattern) => pattern.test(text));
}
