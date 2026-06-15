export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'failed' | 'disconnected';

export interface SessionStatusSnapshot {
  status: ConnectionStatus;
  timestamp: number;
  detail?: string;
  retryCount: number;
  maxRetries: number;
}


