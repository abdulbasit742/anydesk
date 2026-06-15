import { clipboard, ipcMain } from 'electron';

export function registerClipboardIpc(): void {
  ipcMain.handle('remotedesk:clipboard:read-text', () => ({ text: clipboard.readText(), changedAt: Date.now() }));
  ipcMain.handle('remotedesk:clipboard:write-text', (_event, input: { text?: string; sourceSessionId?: string }) => {
    if (typeof input?.text !== 'string' || !input.sourceSessionId) throw new Error('invalid clipboard write payload');
    if (input.text.length > 64_000) throw new Error('clipboard text exceeds limit');
    clipboard.writeText(input.text);
    return { ok: true };
  });
}
