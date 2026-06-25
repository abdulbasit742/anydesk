/**
 * TCP Tunnel IPC Handlers (Main Process)
 * Creates local TCP listeners and connections for port forwarding through WebRTC.
 */

import { ipcMain, BrowserWindow } from "electron";
import * as net from "net";

interface TunnelListener {
  server: net.Server;
  connections: Map<string, net.Socket>;
}

const listeners = new Map<string, TunnelListener>();
const hostConnections = new Map<string, net.Socket>();

export function registerTcpTunnelIpc(getMainWindow: () => BrowserWindow | null): void {
  /**
   * Create a local TCP listener (viewer side)
   * Accepts connections and forwards data to renderer → data channel → host
   */
  ipcMain.handle("tcp-tunnel:create-listener", async (_event, { tunnelId, localPort }: { tunnelId: string; localPort: number }) => {
    try {
      const server = net.createServer((socket) => {
        const connectionId = `${tunnelId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const tunnel = listeners.get(tunnelId);
        if (tunnel) {
          tunnel.connections.set(connectionId, socket);
        }

        socket.on("data", (data) => {
          const mainWindow = getMainWindow();
          if (mainWindow) {
            mainWindow.webContents.send("tcp-tunnel:incoming-data", {
              tunnelId,
              connectionId,
              data: data.toString("base64"),
            });
          }
        });

        socket.on("close", () => {
          const tunnel = listeners.get(tunnelId);
          if (tunnel) {
            tunnel.connections.delete(connectionId);
          }
          const mainWindow = getMainWindow();
          if (mainWindow) {
            mainWindow.webContents.send("tcp-tunnel:connection-closed", {
              tunnelId,
              connectionId,
            });
          }
        });

        socket.on("error", () => {
          socket.destroy();
        });
      });

      await new Promise<void>((resolve, reject) => {
        server.listen(localPort, "127.0.0.1", () => resolve());
        server.on("error", reject);
      });

      listeners.set(tunnelId, { server, connections: new Map() });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  /**
   * Close a local TCP listener
   */
  ipcMain.handle("tcp-tunnel:close-listener", async (_event, { tunnelId }: { tunnelId: string }) => {
    const tunnel = listeners.get(tunnelId);
    if (tunnel) {
      for (const [, socket] of tunnel.connections) {
        socket.destroy();
      }
      tunnel.server.close();
      listeners.delete(tunnelId);
    }
    return { success: true };
  });

  /**
   * Send data to a local TCP connection (from data channel → local socket)
   */
  ipcMain.on("tcp-tunnel:data", (_event, { tunnelId, connectionId, data }: { tunnelId: string; connectionId: string; data: string }) => {
    // Check viewer-side listeners
    const tunnel = listeners.get(tunnelId);
    if (tunnel) {
      const socket = tunnel.connections.get(connectionId);
      if (socket && !socket.destroyed) {
        socket.write(Buffer.from(data, "base64"));
        return;
      }
    }
    // Check host-side connections
    const hostSocket = hostConnections.get(`${tunnelId}_${connectionId}`);
    if (hostSocket && !hostSocket.destroyed) {
      hostSocket.write(Buffer.from(data, "base64"));
    }
  });

  /**
   * Create a TCP connection on the host side (connect to target service)
   */
  ipcMain.handle("tcp-tunnel:create-connection", async (_event, { tunnelId, host, port }: { tunnelId: string; host: string; port: number }) => {
    try {
      const connectionId = `${tunnelId}_host_${Date.now()}`;
      const socket = net.createConnection({ host, port }, () => {
        hostConnections.set(`${tunnelId}_${connectionId}`, socket);
      });

      socket.on("data", (data) => {
        const mainWindow = getMainWindow();
        if (mainWindow) {
          mainWindow.webContents.send("tcp-tunnel:incoming-data", {
            tunnelId,
            connectionId,
            data: data.toString("base64"),
          });
        }
      });

      socket.on("close", () => {
        hostConnections.delete(`${tunnelId}_${connectionId}`);
      });

      socket.on("error", () => {
        socket.destroy();
        hostConnections.delete(`${tunnelId}_${connectionId}`);
      });

      return { success: true, connectionId };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}

/**
 * Clean up all tunnels on app quit
 */
export function cleanupAllTunnels(): void {
  for (const [, tunnel] of listeners) {
    for (const [, socket] of tunnel.connections) {
      socket.destroy();
    }
    tunnel.server.close();
  }
  listeners.clear();

  for (const [, socket] of hostConnections) {
    socket.destroy();
  }
  hostConnections.clear();
}
