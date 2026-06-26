/**
 * Cloud Gaming Preload API
 * Exposes cloud gaming IPC channels to the renderer process securely.
 */

import { contextBridge, ipcRenderer } from "electron";

export const cloudGamingApi = {
  // Hardware encoder detection
  detectEncoders: () =>
    ipcRenderer.invoke("cg:detect-encoders") as Promise<{
      success: boolean;
      encoders: Array<{
        type: string; name: string; vendor: string;
        codecs: string[]; maxWidth: number; maxHeight: number;
        maxFps: number; available: boolean;
      }>;
    }>,

  // Game detection
  detectGames: () =>
    ipcRenderer.invoke("cg:detect-games") as Promise<{
      success: boolean;
      games: Array<{
        name: string; processName: string; platform: string;
        isRunning: boolean; recommendedProfile?: string;
      }>;
    }>,

  // GPU metrics
  getGpuMetrics: () =>
    ipcRenderer.invoke("cg:gpu-metrics") as Promise<{
      success: boolean;
      metrics: { gpuUsage: number; vramUsage: number; gpuTemp: number } | null;
    }>,

  // Virtual display
  createVirtualDisplay: (width: number, height: number, refreshRate: number) =>
    ipcRenderer.invoke("cg:create-virtual-display", width, height, refreshRate) as Promise<{
      success: boolean; displayId?: string; message: string;
    }>,

  // Secure boot check
  checkSecureBoot: () =>
    ipcRenderer.invoke("cg:check-secure-boot") as Promise<{
      enabled: boolean; platform: string; details: string;
    }>,

  // Display info
  getDisplays: () =>
    ipcRenderer.invoke("cg:get-displays") as Promise<{
      success: boolean;
      displays: Array<{
        id: string; name: string; width: number; height: number;
        refreshRate: number; primary: boolean;
      }>;
    }>,

  // HDR status
  getHdrStatus: () =>
    ipcRenderer.invoke("cg:hdr-status") as Promise<{
      success: boolean; hdrEnabled: boolean; format: string | null;
    }>,

  // Wake-on-LAN (local LAN)
  wakeOnLan: (macAddress: string, broadcastIp?: string, port?: number) =>
    ipcRenderer.invoke("cg:wake-on-lan", macAddress, broadcastIp, port) as Promise<{
      success: boolean; message: string;
    }>,

  // Controllers
  getControllers: () =>
    ipcRenderer.invoke("cg:get-controllers") as Promise<{
      success: boolean; message: string;
    }>,

  // Game-specific optimization
  optimizeForGame: (gameName: string) =>
    ipcRenderer.invoke("cg:optimize-for-game", gameName) as Promise<{
      success: boolean; profile: string;
      settings: { encoder: string; codec: string; latencyMode: string; framerate: number; bitrate: number };
    }>,

  // Performance overlay
  getPerformanceOverlay: (metrics: {
    fps: number; latencyMs: number; bitrateKbps: number; packetLoss: number;
    encodeTimeMs: number; decodeTimeMs: number; rttMs: number; jitterMs: number;
  }) =>
    ipcRenderer.invoke("cg:performance-overlay", metrics) as Promise<{
      success: boolean;
      overlay: {
        fps: number; latencyMs: number; bitrateKbps: number; packetLoss: number;
        encodeTimeMs: number; decodeTimeMs: number; rttMs: number; jitterMs: number;
        cpuUsage: number; gpuUsage: number; vramUsage: number; gpuTemp: number;
        timestamp: number;
      };
    }>,

  // Cursor prediction
  setCursorPrediction: (enabled: boolean, predictionMs: number) =>
    ipcRenderer.invoke("cg:cursor-prediction", enabled, predictionMs) as Promise<{
      success: boolean; message: string;
      settings: { enabled: boolean; predictionMs: number; renderHz: number };
    }>,

  // Region of interest encoding
  setRoiSettings: (enabled: boolean, x: number, y: number, width: number, height: number) =>
    ipcRenderer.invoke("cg:roi-settings", enabled, x, y, width, height) as Promise<{
      success: boolean; message: string;
      settings: { enabled: boolean; region: { x: number; y: number; width: number; height: number }; qualityBoost: number };
    }>,
};

export function exposeCloudGamingApi(): void {
  contextBridge.exposeInMainWorld("cloudGaming", cloudGamingApi);
}
