import { contextBridge, ipcRenderer } from "electron";
import type { HardwareStats } from "../main/resourceMonitorIpc.js";

export interface WorkerAgentConfig {
  token: string;
  nodeId: string;
  clusterId: string;
  apiBase: string;
}

export interface WorkerAgentStatus {
  running: boolean;
  nodeId: string | null;
  clusterId: string | null;
  lastHeartbeatAt: number | null;
  lastError: string | null;
  activeTasks: number;
}

export function exposeResourcePoolApi(): void {
  contextBridge.exposeInMainWorld("resourcePool", {
    // Resource monitor
    getStats: (): Promise<{ success: boolean; stats?: HardwareStats; error?: string }> =>
      ipcRenderer.invoke("resource:get-stats"),

    startPoll: (intervalMs?: number): Promise<{ success: boolean }> =>
      ipcRenderer.invoke("resource:start-poll", intervalMs ?? 5000),

    stopPoll: (): Promise<{ success: boolean }> =>
      ipcRenderer.invoke("resource:stop-poll"),

    onStatsUpdate: (callback: (stats: HardwareStats) => void) => {
      const handler = (_event: Electron.IpcRendererEvent, stats: HardwareStats) => callback(stats);
      ipcRenderer.on("resource:stats-update", handler);
      return () => ipcRenderer.removeListener("resource:stats-update", handler);
    },

    // Worker agent
    startAgent: (config: WorkerAgentConfig): Promise<{ success: boolean }> =>
      ipcRenderer.invoke("worker:start", config),

    stopAgent: (): Promise<{ success: boolean }> =>
      ipcRenderer.invoke("worker:stop"),

    getAgentStatus: (): Promise<WorkerAgentStatus> =>
      ipcRenderer.invoke("worker:status"),
  });
}
