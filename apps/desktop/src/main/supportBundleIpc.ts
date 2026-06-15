import { dialog, ipcMain } from 'electron';
import { promises as fs } from 'node:fs';

export function registerSupportBundleIpc(): void {
  ipcMain.handle('remotedesk:diagnostics:export-support-bundle', async (_event, input: { fileName?: string; json?: string }) => {
    if (!input?.fileName || typeof input.json !== 'string') throw new Error('invalid support bundle payload');
    if (input.json.length > 10 * 1024 * 1024) throw new Error('support bundle too large');
    const result = await dialog.showSaveDialog({ defaultPath: input.fileName, filters: [{ name: 'JSON', extensions: ['json'] }] });
    if (result.canceled || !result.filePath) return { accepted: false };
    await fs.writeFile(result.filePath, input.json, 'utf8');
    return { accepted: true, path: result.filePath };
  });
}
