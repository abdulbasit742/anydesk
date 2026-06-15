import { contextBridge, ipcRenderer } from 'electron';

export function exposeFileTransferApi(): void {
  contextBridge.exposeInMainWorld('remoteDeskFileTransfer', {
    pickFiles: (options?: { allowMultiple?: boolean; maxBytes?: number }) => ipcRenderer.invoke('remotedesk:file-transfer:pick-files', options),
    chooseSaveTarget: (offer: { transferId: string; fileName: string; size: number }) => ipcRenderer.invoke('remotedesk:file-transfer:choose-save-target', offer),
    readFileChunk: (input: { pathToken: string; offset: number; length: number }) => ipcRenderer.invoke('remotedesk:file-transfer:read-chunk', input),
    writeReceivedChunk: (input: { pathToken: string; offset: number; bytes: ArrayBuffer }) => ipcRenderer.invoke('remotedesk:file-transfer:write-chunk', input),
    finalizeReceivedFile: (input: { pathToken: string; expectedBytes: number }) => ipcRenderer.invoke('remotedesk:file-transfer:finalize', input),
    cancelFileToken: (pathToken: string) => ipcRenderer.invoke('remotedesk:file-transfer:cancel-token', pathToken),
  });
}
