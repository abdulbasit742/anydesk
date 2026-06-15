import type { HeartbeatPing, HeartbeatPong } from './heartbeatTypes.js';

export function createHeartbeatPing(pingId: string, sentAtMs: number): HeartbeatPing {
  return { kind: 'heartbeat.ping', pingId, sentAtMs };
}

export function createHeartbeatPong(ping: HeartbeatPing, receivedAtMs: number, repliedAtMs: number): HeartbeatPong {
  return { kind: 'heartbeat.pong', pingId: ping.pingId, sentAtMs: ping.sentAtMs, receivedAtMs, repliedAtMs };
}

export function latencyFromPong(pong: HeartbeatPong, observedAtMs: number): number {
  return Math.max(0, observedAtMs - pong.sentAtMs);
}
