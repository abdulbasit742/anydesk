/**
 * TCP Tunnel Service
 * Allows port forwarding through the WebRTC data channel.
 * 
 * Use case: Access services on the remote machine (e.g., SSH, database, web server)
 * through the encrypted RemoteDesk connection.
 * 
 * Architecture:
 * - Viewer creates a local TCP listener on a chosen port
 * - Data is forwarded through a WebRTC data channel to the host
 * - Host connects to the target port on localhost and relays data back
 * 
 * Protocol messages sent via data channel:
 * - tunnel.open { tunnelId, remoteHost, remotePort }
 * - tunnel.data { tunnelId, connectionId, data (base64) }
 * - tunnel.close { tunnelId, connectionId }
 * - tunnel.error { tunnelId, connectionId, error }
 */

export interface TunnelConfig {
  id: string;
  localPort: number;
  remoteHost: string;
  remotePort: number;
  label?: string;
}

export interface TunnelOpenMessage {
  kind: "tunnel.open";
  tunnelId: string;
  remoteHost: string;
  remotePort: number;
}

export interface TunnelDataMessage {
  kind: "tunnel.data";
  tunnelId: string;
  connectionId: string;
  data: string; // base64 encoded
}

export interface TunnelCloseMessage {
  kind: "tunnel.close";
  tunnelId: string;
  connectionId: string;
}

export interface TunnelErrorMessage {
  kind: "tunnel.error";
  tunnelId: string;
  connectionId?: string;
  error: string;
}

export type TunnelMessage = TunnelOpenMessage | TunnelDataMessage | TunnelCloseMessage | TunnelErrorMessage;

export function isTunnelMessage(value: unknown): value is TunnelMessage {
  if (typeof value !== "object" || value === null || !("kind" in value)) return false;
  const kind = String((value as { kind: unknown }).kind);
  return kind.startsWith("tunnel.");
}

export interface TunnelState {
  id: string;
  localPort: number;
  remoteHost: string;
  remotePort: number;
  label?: string;
  status: "connecting" | "active" | "closed" | "error";
  activeConnections: number;
  bytesTransferred: number;
  createdAt: number;
}

export class TcpTunnelManager {
  private tunnels: Map<string, TunnelState> = new Map();
  private sendMessage: (msg: TunnelMessage) => void;
  private onStateChange?: (tunnels: TunnelState[]) => void;

  constructor(options: {
    sendMessage: (msg: TunnelMessage) => void;
    onStateChange?: (tunnels: TunnelState[]) => void;
  }) {
    this.sendMessage = options.sendMessage;
    this.onStateChange = options.onStateChange;
  }

  /** Create a new tunnel (viewer side) */
  createTunnel(config: TunnelConfig): void {
    const state: TunnelState = {
      id: config.id,
      localPort: config.localPort,
      remoteHost: config.remoteHost,
      remotePort: config.remotePort,
      label: config.label,
      status: "connecting",
      activeConnections: 0,
      bytesTransferred: 0,
      createdAt: Date.now(),
    };
    this.tunnels.set(config.id, state);
    this.emitState();

    // Send open request to host
    this.sendMessage({
      kind: "tunnel.open",
      tunnelId: config.id,
      remoteHost: config.remoteHost,
      remotePort: config.remotePort,
    });

    // The actual TCP listener is created via IPC in the main process
    if (window.electronAPI?.createTcpListener) {
      window.electronAPI.createTcpListener({
        tunnelId: config.id,
        localPort: config.localPort,
      });
    }

    state.status = "active";
    this.emitState();
  }

  /** Close a tunnel */
  closeTunnel(tunnelId: string): void {
    const tunnel = this.tunnels.get(tunnelId);
    if (!tunnel) return;

    tunnel.status = "closed";
    this.emitState();

    this.sendMessage({
      kind: "tunnel.close",
      tunnelId,
      connectionId: "*", // close all connections
    });

    // Close local TCP listener
    if (window.electronAPI?.closeTcpListener) {
      window.electronAPI.closeTcpListener({ tunnelId });
    }

    this.tunnels.delete(tunnelId);
    this.emitState();
  }

  /** Handle incoming tunnel messages from data channel */
  handleMessage(msg: TunnelMessage): void {
    switch (msg.kind) {
      case "tunnel.data": {
        const tunnel = this.tunnels.get(msg.tunnelId);
        if (tunnel) {
          tunnel.bytesTransferred += msg.data.length * 0.75; // approximate base64 decode size
          this.emitState();
        }
        // Forward data to local TCP connection via IPC
        if (window.electronAPI?.tunnelData) {
          window.electronAPI.tunnelData({
            tunnelId: msg.tunnelId,
            connectionId: msg.connectionId,
            data: msg.data,
          });
        }
        break;
      }
      case "tunnel.close": {
        const tunnel = this.tunnels.get(msg.tunnelId);
        if (tunnel) {
          tunnel.activeConnections = Math.max(0, tunnel.activeConnections - 1);
          this.emitState();
        }
        break;
      }
      case "tunnel.error": {
        const tunnel = this.tunnels.get(msg.tunnelId);
        if (tunnel) {
          tunnel.status = "error";
          this.emitState();
        }
        break;
      }
      case "tunnel.open": {
        // Host side: create connection to target
        if (window.electronAPI?.createTcpConnection) {
          window.electronAPI.createTcpConnection({
            tunnelId: msg.tunnelId,
            host: msg.remoteHost,
            port: msg.remotePort,
          });
        }
        break;
      }
    }
  }

  /** Get all active tunnels */
  getTunnels(): TunnelState[] {
    return Array.from(this.tunnels.values());
  }

  /** Dispose all tunnels */
  dispose(): void {
    for (const [id] of this.tunnels) {
      this.closeTunnel(id);
    }
  }

  private emitState(): void {
    this.onStateChange?.(this.getTunnels());
  }
}
