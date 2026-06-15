import { contextBridge, ipcRenderer } from 'electron';

export function exposeClipboardApi(): void {
  contextBridge.exposeInMainWorld('remoteDeskClipboard', {
    readText: () => ipcRenderer.invoke('remotedesk:clipboard:read-text'),
    writeText: (input: { text: string; sourceSessionId: string }) => ipcRenderer.invoke('remotedesk:clipboard:write-text', input),
  });
}
