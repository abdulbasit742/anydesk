import { ipcMain } from "electron";
import os from "os";
import si from "systeminformation";

export async function getDeviceMetricsInternal() {
  const cpuData = await si.currentLoad();
  const memData = await si.mem();
  const diskData = await si.fsSize();
  const networkData = await si.networkStats();

  return {
    cpu: cpuData.currentLoad,
    memory: { total: memData.total, used: memData.used },
    disk: { total: diskData[0]?.size ?? 0, used: diskData[0]?.used ?? 0, free: diskData[0]?.available ?? 0 },
    network: networkData.map(n => ({ iface: n.iface, rx: n.rx_bytes, tx: n.tx_bytes }))
  };
}

export function registerMetricsIpc() {
  ipcMain.handle("metrics:get-device-metrics", async () => {
    return getDeviceMetricsInternal();
  });
}
