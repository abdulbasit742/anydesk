export type SessionId = string & { __brand: 'SessionId' };

export interface SessionLifecycle {
  id: SessionId;
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
  hostDeviceId: string;
  clientDeviceId: string;
}

export type SessionPhase = 'created' | 'signaling' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'ended';

export const sessionPhaseTransitions: Record<SessionPhase, SessionPhase[]> = {
  created: ['signaling', 'ended'],
  signaling: ['connecting', 'ended'],
  connecting: ['connected', 'reconnecting', 'ended'],
  connected: ['reconnecting', 'disconnected', 'ended'],
  reconnecting: ['connected', 'disconnected', 'ended'],
  disconnected: ['ended'],
  ended: [],
};


