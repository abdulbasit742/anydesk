import { contextBridge, ipcRenderer } from 'electron';

export function exposeDiagnosticsApi(): void {
  contextBridge.exposeInMainWorld('remoteDeskDiagnostics', {
    exportSupportBundle: (input: { fileName: string; json: string }) => ipcRenderer.invoke('remotedesk:diagnostics:export-support-bundle', input),
  });
}
