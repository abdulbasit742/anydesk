/**
 * IoT & Smart Device Remote Management — Preload API Bridge
 */

import { ipcRenderer } from "electron";

export const iotManagementApi = {
  // Network discovery
  getLocalNetwork: () => ipcRenderer.invoke("iot:getLocalNetwork"),
  discoverMdns: () => ipcRenderer.invoke("iot:discoverMdns"),
  discoverSsdp: () => ipcRenderer.invoke("iot:discoverSsdp"),
  arpScan: (subnet?: string) => ipcRenderer.invoke("iot:arpScan", subnet),
  fullNetworkScan: (subnet?: string) => ipcRenderer.invoke("iot:fullNetworkScan", subnet),
  ping: (host: string, port?: number) => ipcRenderer.invoke("iot:ping", host, port),

  // System monitoring
  getLocalSystemInfo: () => ipcRenderer.invoke("iot:getLocalSystemInfo"),

  // Wake-on-LAN
  sendWoL: (mac: string) => ipcRenderer.invoke("iot:sendWoL", mac),

  // Secure tunnels
  startTunnel: (tunnelId: string, localPort: number, remoteHost: string, remotePort: number, jumpHost?: string) =>
    ipcRenderer.invoke("iot:startTunnel", tunnelId, localPort, remoteHost, remotePort, jumpHost),
  stopTunnel: (tunnelId: string) => ipcRenderer.invoke("iot:stopTunnel", tunnelId),
  listActiveTunnels: () => ipcRenderer.invoke("iot:listActiveTunnels"),

  // SSH commands
  sshCommand: (host: string, port: number, username: string, command: string) =>
    ipcRenderer.invoke("iot:sshCommand", host, port, username, command),

  // Camera streaming
  getCameraStreamUrl: (ip: string, port: number, protocol: string, username?: string, password?: string) =>
    ipcRenderer.invoke("iot:getCameraStreamUrl", ip, port, protocol, username, password),

  // NAS browsing
  browseNas: (host: string, port: number, path: string, protocol: string) =>
    ipcRenderer.invoke("iot:browseNas", host, port, path, protocol),

  // Service management
  restartService: (host: string, username: string, service: string) =>
    ipcRenderer.invoke("iot:restartService", host, username, service),

  // Network topology
  buildTopology: (devices: any[]) => ipcRenderer.invoke("iot:buildTopology", devices),
};
