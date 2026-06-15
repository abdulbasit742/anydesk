import { dialog, ipcMain } from 'electron';
import { createReadStream, createWriteStream, promises as fs } from 'node:fs';
import { basename } from 'node:path';
import { randomUUID } from 'node:crypto';

interface FileToken { path: string; mode: 'read' | 'write'; bytesWritten: number }
const fileTokens = new Map<string, FileToken>();

function tokenFor(path: string, mode: FileToken['mode']): string {
  const token = `file_${randomUUID()}`;
  fileTokens.set(token, { path, mode, bytesWritten: 0 });
  return token;
}

function requireToken(token: string, mode: FileToken['mode']): FileToken {
  const record = fileTokens.get(token);
  if (!record || record.mode !== mode) throw new Error('invalid or expired file token');
  return record;
}

export function registerFileTransferIpc(): void {
  ipcMain.handle('remotedesk:file-transfer:pick-files', async (_event, options: { allowMultiple?: boolean; maxBytes?: number } = {}) => {
    const result = await dialog.showOpenDialog({ properties: options.allowMultiple ? ['openFile', 'multiSelections'] : ['openFile'] });
    if (result.canceled) return [];
    const files = [];
    for (const path of result.filePaths) {
      const stat = await fs.stat(path);
      if (options.maxBytes && stat.size > options.maxBytes) continue;
      files.push({ id: randomUUID(), name: basename(path), size: stat.size, mimeType: 'application/octet-stream', lastModified: stat.mtimeMs, pathToken: tokenFor(path, 'read') });
    }
    return files;
  });

  ipcMain.handle('remotedesk:file-transfer:choose-save-target', async (_event, offer: { transferId?: string; fileName?: string; size?: number }) => {
    if (!offer?.transferId || !offer.fileName || typeof offer.size !== 'number') throw new Error('invalid save target payload');
    const result = await dialog.showSaveDialog({ defaultPath: offer.fileName, properties: ['createDirectory', 'showOverwriteConfirmation'] });
    if (result.canceled || !result.filePath) return { accepted: false };
    return { accepted: true, pathToken: tokenFor(result.filePath, 'write'), fileName: basename(result.filePath) };
  });

  ipcMain.handle('remotedesk:file-transfer:read-chunk', async (_event, input: { pathToken?: string; offset?: number; length?: number }) => {
    if (!input?.pathToken || typeof input.offset !== 'number' || typeof input.length !== 'number') throw new Error('invalid read chunk payload');
    const record = requireToken(input.pathToken, 'read');
    const handle = await fs.open(record.path, 'r');
    try {
      const buffer = Buffer.alloc(input.length);
      const { bytesRead } = await handle.read(buffer, 0, input.length, input.offset);
      return buffer.subarray(0, bytesRead).buffer.slice(buffer.byteOffset, buffer.byteOffset + bytesRead);
    } finally {
      await handle.close();
    }
  });

  ipcMain.handle('remotedesk:file-transfer:write-chunk', async (_event, input: { pathToken?: string; offset?: number; bytes?: ArrayBuffer }) => {
    if (!input?.pathToken || typeof input.offset !== 'number' || !(input.bytes instanceof ArrayBuffer)) throw new Error('invalid write chunk payload');
    const record = requireToken(input.pathToken, 'write');
    const handle = await fs.open(record.path, 'a+');
    try {
      const buffer = Buffer.from(input.bytes);
      await handle.write(buffer, 0, buffer.length, input.offset);
      record.bytesWritten = Math.max(record.bytesWritten, input.offset + buffer.length);
      return { bytesWritten: buffer.length };
    } finally {
      await handle.close();
    }
  });

  ipcMain.handle('remotedesk:file-transfer:finalize', async (_event, input: { pathToken?: string; expectedBytes?: number }) => {
    if (!input?.pathToken || typeof input.expectedBytes !== 'number') throw new Error('invalid finalize payload');
    const record = requireToken(input.pathToken, 'write');
    const stat = await fs.stat(record.path);
    if (stat.size !== input.expectedBytes) throw new Error(`received file size mismatch: ${stat.size} != ${input.expectedBytes}`);
    fileTokens.delete(input.pathToken);
    return { ok: true, bytesWritten: stat.size };
  });

  ipcMain.handle('remotedesk:file-transfer:cancel-token', (_event, pathToken: string) => {
    fileTokens.delete(pathToken);
  });
}
