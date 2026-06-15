/**
 * RemoteDesk TypeScript SDK
 * npm install @remotedesk/sdk
 */

import { io, Socket } from "socket.io-client";

export interface RemoteDeskConfig {
  apiUrl: string;
  socketUrl: string;
  apiKey?: string;
  timeout?: number;
}

export class RemoteDeskClient {
  private socket: Socket | null = null;
  private token: string | null = null;
  private deskId: string | null = null;

  constructor(private config: RemoteDeskConfig) {}

  /** Authenticate with email and password */
  async login(email: string, password: string): Promise<{ token: string; deskId: string }> {
    const res = await fetch(`${this.config.apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(`Login failed: ${res.status}`);
    const data = await res.json();
    this.token = data.token;
    this.deskId = data.deskId;
    return data;
  }

  /** Connect to signaling server */
  connect(): Socket {
    if (!this.token) throw new Error("Not authenticated");
    this.socket = io(this.config.socketUrl, {
      auth: { token: this.token },
      transports: ["websocket"],
    });
    return this.socket;
  }

  /** Get current desk ID */
  getDeskId(): string | null {
    return this.deskId;
  }

  /** Disconnect */
  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  /** Check if connected to signaling */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export default RemoteDeskClient;
