import type { DeviceAccessPolicySnapshot, SessionPermissionSet } from "@shared/index";
import type { RemoteInputPermissionState } from "./remoteInput.js";

export type SessionMessageType = "heartbeat" | "chat" | "remote-input" | "permission";

export interface SessionEnvelope<T = unknown> {
  id: string;
  type: SessionMessageType;
  payload: T;
  timestamp: number;
  senderId: string;
  sessionId: string;
}

export interface SessionChatPayload {
  messageId: string;
  content: string;
}

export interface SessionChatMessage {
  id: string;
  sender: "local" | "remote" | "system";
  content: string;
  timestamp: number;
}

export interface PermissionSnapshotFrame {
  kind: "permission.snapshot";
  input: RemoteInputPermissionState;
  sessionPermissions: SessionPermissionSet | null;
  policy: DeviceAccessPolicySnapshot | null;
  reason?: string;
  version: number;
}

export interface SessionDataChannelLike {
  readonly readyState: RTCDataChannelState;
  send(data: string | ArrayBuffer | Blob | ArrayBufferView): void;
  addEventListener(type: "message", listener: (event: MessageEvent) => void): void;
  addEventListener(type: "open" | "close" | "error", listener: EventListener): void;
  removeEventListener(type: "message", listener: (event: MessageEvent) => void): void;
  removeEventListener(type: "open" | "close" | "error", listener: EventListener): void;
}

type Handler<T = unknown> = (envelope: SessionEnvelope<T>) => void;

const MAX_BUFFERED_BYTES = 512 * 1024;

export function createPermissionSnapshotFrame(input: {
  input: RemoteInputPermissionState;
  sessionPermissions: SessionPermissionSet | null;
  policy: DeviceAccessPolicySnapshot | null;
  reason?: string;
  version: number;
}): PermissionSnapshotFrame {
  return {
    kind: "permission.snapshot",
    input: input.input,
    sessionPermissions: input.sessionPermissions,
    policy: input.policy,
    reason: input.reason,
    version: input.version
  };
}

export function isPermissionSnapshotFrame(value: unknown): value is PermissionSnapshotFrame {
  const frame = value as Partial<PermissionSnapshotFrame> | null;
  return (
    Boolean(frame) &&
    frame?.kind === "permission.snapshot" &&
    typeof frame.version === "number" &&
    typeof frame.input === "object"
  );
}

function createId(prefix: string) {
  const random = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
  return `${prefix}-${random}`;
}

export class SessionDataChannel {
  private handlers = new Map<SessionMessageType, Set<Handler>>();
  private heartbeatTimer: number | null = null;
  private readyListeners = new Set<(ready: boolean) => void>();

  constructor(
    private channel: RTCDataChannel,
    private sessionId: string,
    private senderId: string
  ) {
    this.channel.bufferedAmountLowThreshold = MAX_BUFFERED_BYTES / 2;
    this.channel.onmessage = (event) => this.handleMessage(event);
    this.channel.onopen = () => this.emitReady(true);
    this.channel.onclose = () => this.emitReady(false);
    this.channel.onerror = () => this.emitReady(false);
  }

  get ready() {
    return this.channel.readyState === "open";
  }

  asDataChannelLike(): SessionDataChannelLike {
    return this.channel;
  }

  onReadyChange(callback: (ready: boolean) => void) {
    this.readyListeners.add(callback);
    callback(this.ready);
    return () => this.readyListeners.delete(callback);
  }

  subscribe<T>(type: SessionMessageType, handler: Handler<T>) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)?.add(handler as Handler);
    return () => this.handlers.get(type)?.delete(handler as Handler);
  }

  async send<T>(type: SessionMessageType, payload: T) {
    const envelope: SessionEnvelope<T> = {
      id: createId(type),
      type,
      payload,
      timestamp: Date.now(),
      senderId: this.senderId,
      sessionId: this.sessionId
    };

    await this.waitForBackpressure();
    if (!this.ready) {
      throw new Error("Session data channel is not open");
    }
    this.channel.send(JSON.stringify(envelope));
  }

  async sendChat(content: string) {
    const trimmed = content.trim();
    if (!trimmed) return null;

    const message: SessionChatMessage = {
      id: createId("chat"),
      sender: "local",
      content: trimmed,
      timestamp: Date.now()
    };

    await this.send<SessionChatPayload>("chat", {
      messageId: message.id,
      content: trimmed
    });
    return message;
  }

  startHeartbeat(intervalMs = 5000) {
    this.stopHeartbeat();
    this.heartbeatTimer = window.setInterval(() => {
      if (this.ready) {
        void this.send("heartbeat", { sentAt: Date.now() }).catch(() => undefined);
      }
    }, intervalMs);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer !== null) {
      window.clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  close() {
    this.stopHeartbeat();
    this.handlers.clear();
    this.readyListeners.clear();
    if (this.channel.readyState !== "closed") {
      this.channel.close();
    }
  }

  private emitReady(ready: boolean) {
    this.readyListeners.forEach((listener) => listener(ready));
  }

  private handleMessage(event: MessageEvent) {
    if (typeof event.data !== "string") return;

    try {
      const envelope = JSON.parse(event.data) as SessionEnvelope;
      if (!this.isEnvelope(envelope)) return;
      const typeHandlers = this.handlers.get(envelope.type);
      typeHandlers?.forEach((handler) => handler(envelope));
    } catch {
      // Ignore malformed peer messages. A future diagnostics panel can count these.
    }
  }

  private isEnvelope(value: Partial<SessionEnvelope>): value is SessionEnvelope {
    return (
      typeof value.id === "string" &&
      typeof value.sessionId === "string" &&
      value.sessionId === this.sessionId &&
      typeof value.senderId === "string" &&
      typeof value.timestamp === "number" &&
      (value.type === "heartbeat" || value.type === "chat" || value.type === "remote-input" || value.type === "permission")
    );
  }

  private async waitForBackpressure() {
    if (this.channel.bufferedAmount <= MAX_BUFFERED_BYTES) return;

    await new Promise<void>((resolve) => {
      const done = () => {
        this.channel.removeEventListener("bufferedamountlow", done);
        resolve();
      };
      this.channel.addEventListener("bufferedamountlow", done, { once: true });
    });
  }
}
