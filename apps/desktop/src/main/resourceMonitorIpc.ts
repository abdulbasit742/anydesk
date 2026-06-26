/**
 * Resource Monitor IPC — Main Process
 *
 * Collects CPU, RAM, GPU, temperature, and network statistics from the host
 * machine using the `systeminformation` library. Exposes them to the renderer
 * via IPC so the worker agent can report telemetry to the cluster coordinator.
 *
 * IPC channels:
 *   resource:get-stats   → Returns current hardware stats snapshot
 *   resource:start-poll  → Starts polling at the given interval (ms)
 *   resource:stop-poll   → Stops polling
 */

import { ipcMain } from "electron";
import si from "systeminformation";

export interface HardwareStats {
  cpuPercent: number;
  ramPercent: number;
  ramUsedMb: number;
  ramTotalMb: number;
  gpuPercent: number | null;
  gpuVramUsedMb: number | null;
  gpuVramTotalMb: number | null;
  gpuTempC: number | null;
  cpuTempC: number | null;
  networkUpKbps: number;
  networkDownKbps: number;
  platform: string;
  hostname: string;
  collectedAt: number;
}

let pollInterval: ReturnType<typeof setInterval> | null = null;
let lastNetworkStats: { rx: number; tx: number; ts: number } | null = null;

async function collectStats(): Promise<HardwareStats> {
  const [cpuLoad, mem, graphics, cpuTemp, networkStats, osInfo] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.graphics(),
    si.cpuTemperature().catch(() => ({ main: null })),
    si.networkStats().catch(() => []),
    si.osInfo(),
  ]);

  // CPU
  const cpuPercent = Math.round(cpuLoad.currentLoad * 10) / 10;

  // RAM
  const ramTotalMb = Math.round(mem.total / 1024 / 1024);
  const ramUsedMb = Math.round((mem.total - mem.available) / 1024 / 1024);
  const ramPercent = Math.round((ramUsedMb / ramTotalMb) * 1000) / 10;

  // GPU — use first discrete GPU if available
  const gpuControllers = graphics.controllers ?? [];
  const discreteGpu = gpuControllers.find(
    (g) => g.vendor && !g.vendor.toLowerCase().includes("intel") && g.memoryTotal
  ) ?? gpuControllers[0] ?? null;

  const gpuPercent = discreteGpu?.utilizationGpu ?? null;
  const gpuVramTotalMb = discreteGpu?.memoryTotal ?? null;
  const gpuVramUsedMb = discreteGpu?.memoryUsed ?? null;
  const gpuTempC = discreteGpu?.temperatureGpu ?? null;

  // CPU Temperature
  const cpuTempC = typeof cpuTemp.main === "number" ? cpuTemp.main : null;

  // Network — compute delta since last poll
  let networkUpKbps = 0;
  let networkDownKbps = 0;
  if (Array.isArray(networkStats) && networkStats.length > 0) {
    const agg = networkStats.reduce(
      (acc, iface) => ({ rx: acc.rx + (iface.rx_bytes ?? 0), tx: acc.tx + (iface.tx_bytes ?? 0) }),
      { rx: 0, tx: 0 }
    );
    const now = Date.now();
    if (lastNetworkStats) {
      const dtSec = (now - lastNetworkStats.ts) / 1000;
      if (dtSec > 0) {
        networkUpKbps = Math.max(0, ((agg.tx - lastNetworkStats.tx) / dtSec) / 1024);
        networkDownKbps = Math.max(0, ((agg.rx - lastNetworkStats.rx) / dtSec) / 1024);
      }
    }
    lastNetworkStats = { rx: agg.rx, tx: agg.tx, ts: now };
  }

  return {
    cpuPercent,
    ramPercent,
    ramUsedMb,
    ramTotalMb,
    gpuPercent: gpuPercent !== undefined ? gpuPercent : null,
    gpuVramUsedMb: gpuVramUsedMb !== undefined ? gpuVramUsedMb : null,
    gpuVramTotalMb: gpuVramTotalMb !== undefined ? gpuVramTotalMb : null,
    gpuTempC: gpuTempC !== undefined ? gpuTempC : null,
    cpuTempC,
    networkUpKbps: Math.round(networkUpKbps * 10) / 10,
    networkDownKbps: Math.round(networkDownKbps * 10) / 10,
    platform: osInfo.platform,
    hostname: osInfo.hostname,
    collectedAt: Date.now(),
  };
}

export function registerResourceMonitorIpc(): void {
  // One-shot stats request
  ipcMain.handle("resource:get-stats", async () => {
    try {
      return { success: true, stats: await collectStats() };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

  // Start periodic polling — pushes stats to renderer via webContents.send
  ipcMain.handle("resource:start-poll", async (event, intervalMs: number = 5000) => {
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(async () => {
      try {
        const stats = await collectStats();
        event.sender.send("resource:stats-update", stats);
      } catch {
        // Silently ignore poll errors
      }
    }, Math.max(intervalMs, 2000));
    return { success: true };
  });

  // Stop polling
  ipcMain.handle("resource:stop-poll", async () => {
    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
    return { success: true };
  });
}
