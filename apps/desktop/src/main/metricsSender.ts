import { ipcMain, BrowserWindow } from "electron";
import os from "os";
import axios from "axios";
import { registerMetricsIpc } from "./metricsIpc.js";

const METRICS_INTERVAL = 5000; // Send metrics every 5 seconds

export function startMetricsSender(mainWindow: () => BrowserWindow | null) {
  registerMetricsIpc(); // Ensure metrics IPC is registered

  setInterval(async () => {
    const window = mainWindow();
    if (window) {
      try {
        const metrics = await window.webContents.ipcRenderer.invoke("metrics:get-device-metrics");
        await axios.post('http://localhost:3000/api/metrics/device-metrics', { deviceId: os.hostname(), metrics });
      } catch (error) {
        console.error("Failed to get or send metrics:", error);
      }
    }
  }, METRICS_INTERVAL);
}
