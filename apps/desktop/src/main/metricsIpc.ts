import { ipcMain } from "electron";
import os from "os";
import si from "systeminformation";

export function registerMetricsIpc() {
  ipcMain.handle("metrics:get-device-metrics", async () => {
    const cpuData = await si.currentLoad();
    const memData = await si.mem();
    const diskData = await si.fsSize();
    const networkData = await si.networkStats();

    return {
      cpu: cpuData.currentLoad,
      memory: { total: memData.total, used: memData.used },
      disk: { total: diskData[0].size, used: diskData[0].used, free: diskData[0].available },
      network: networkData.map(n => ({ iface: n.iface, rx: n.rx_bytes, tx: n.tx_bytes }))
    };
  });
}
