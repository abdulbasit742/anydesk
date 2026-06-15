export type SessionRole = 'host' | 'viewer';

export type ConnectionPhase =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'degraded'
  | 'reconnecting'
  | 'failed'
  | 'closed';

export interface DesktopSessionContext {
  sessionId: string;
  deviceId: string;
  role: SessionRole;
  peerDeviceId?: string;
  startedAt: number;
}

export interface RemoteDeskDataChannelLike {
  readonly readyState: RTCDataChannelState;
  send(data: string | ArrayBuffer | Blob | ArrayBufferView): void;
  addEventListener(type: 'message', listener: (event: MessageEvent) => void): void;
  addEventListener(type: 'open' | 'close' | 'error', listener: EventListener): void;
  removeEventListener(type: 'message', listener: (event: MessageEvent) => void): void;
  removeEventListener(type: 'open' | 'close' | 'error', listener: EventListener): void;
}

export interface ToastSink {
  success(message: string): void;
  warning(message: string): void;
  error(message: string): void;
  info(message: string): void;
}

export interface RemoteDeskSocketLike {
  readonly connected?: boolean;
  emit(eventName: string, payload: unknown, acknowledgement?: (response: unknown) => void): void;
}

export interface TimelineEntry {
  id: string;
  at: number;
  level: 'info' | 'warning' | 'error' | 'success';
  title: string;
  detail?: string;
  category: 'session' | 'network' | 'file-transfer' | 'clipboard' | 'input' | 'security' | 'diagnostics';
}

export const nowMs = (): number => Date.now();
