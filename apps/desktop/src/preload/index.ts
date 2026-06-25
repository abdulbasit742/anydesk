import { contextBridge, ipcRenderer } from "electron";
import { exposeClipboardApi } from "./clipboardApi.js";
import { exposeDiagnosticsApi } from "./diagnosticsApi.js";
import { exposeFileTransferApi } from "./fileTransferApi.js";
import { exposeInputApi } from "./inputApi.js";
import { exposeCloudGamingApi } from "./cloudGamingApi.js";

const api = {
  platform: () => ipcRenderer.invoke("app:platform") as Promise<NodeJS.Platform>,
  screenSources: () =>
    ipcRenderer.invoke("screen:sources") as Promise<Array<{ id: string; name: string; thumbnail: string }>>,
  inputSetPermissions: (sessionId: string, permissions: { mouse: boolean; keyboard: boolean; emergencyStopped: boolean; lastChangedAt: number }) =>
    ipcRenderer.invoke("input:set-permissions", sessionId, permissions) as Promise<{ success: boolean }>,
  inputEmergencyStop: (sessionId: string) =>
    ipcRenderer.invoke("input:emergency-stop", sessionId) as Promise<{ success: boolean }>,
  inputExecute: (command: { sessionId: string; type: string; payload: Record<string, unknown> }) =>
    ipcRenderer.invoke("input:execute", command) as Promise<{ success: boolean; mode: "noop"; reason?: string; commandType?: string; executedAt: number }>
};

contextBridge.exposeInMainWorld("remoteDesk", api);
exposeClipboardApi();
exposeDiagnosticsApi();
exposeFileTransferApi();
exposeInputApi();
exposeCloudGamingApi();

export type RemoteDeskApi = typeof api;
