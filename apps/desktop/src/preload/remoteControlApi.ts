/**
 * Preload API for Remote Control and TCP Tunnel features.
 * Exposes IPC channels to the renderer process securely.
 */

import { ipcRenderer } from "electron";

export const remoteControlApi = {
  /** Lock the remote workstation */
  lockScreen: (): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke("remote-control:lock-screen"),

  /** Restart the remote machine */
  restart: (options?: { delaySeconds?: number }): Promise<{ success: boolean; error?: string; message?: string }> =>
    ipcRenderer.invoke("remote-control:restart", options),

  /** Log off the current user */
  logoff: (): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke("remote-control:logoff"),

  /** Cancel a pending restart */
  cancelRestart: (): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke("remote-control:cancel-restart"),

  /** Open a URL on the host machine */
  openUrl: (url: string): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke("remote-control:open-url", { url }),
};

export const tcpTunnelApi = {
  /** Create a local TCP listener for port forwarding */
  createTcpListener: (options: { tunnelId: string; localPort: number }): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke("tcp-tunnel:create-listener", options),

  /** Close a local TCP listener */
  closeTcpListener: (options: { tunnelId: string }): Promise<{ success: boolean }> =>
    ipcRenderer.invoke("tcp-tunnel:close-listener", options),

  /** Send data through a tunnel connection */
  tunnelData: (options: { tunnelId: string; connectionId: string; data: string }): void =>
    ipcRenderer.send("tcp-tunnel:data", options),

  /** Create a TCP connection on the host side */
  createTcpConnection: (options: { tunnelId: string; host: string; port: number }): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke("tcp-tunnel:create-connection", options),

  /** Listen for incoming tunnel data from main process */
  onTunnelData: (callback: (data: { tunnelId: string; connectionId: string; data: string }) => void): void => {
    ipcRenderer.on("tcp-tunnel:incoming-data", (_event, data) => callback(data));
  },

  /** Listen for tunnel connection close events */
  onTunnelClose: (callback: (data: { tunnelId: string; connectionId: string }) => void): void => {
    ipcRenderer.on("tcp-tunnel:connection-closed", (_event, data) => callback(data));
  },
};
