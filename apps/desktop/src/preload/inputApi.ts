import { contextBridge, ipcRenderer } from 'electron';

export function exposeInputApi(): void {
  contextBridge.exposeInMainWorld('remoteDeskInput', {
    setRemoteInputEnabled: (input: { sessionId: string; enabled: boolean }) => ipcRenderer.invoke('remotedesk:input:set-enabled', input),
    emergencyStop: (input: { sessionId: string; reason?: string }) => ipcRenderer.invoke('remotedesk:input:emergency-stop', input),
    getRemoteInputState: (input: { sessionId: string }) => ipcRenderer.invoke('remotedesk:input:get-state', input),
  });
}
