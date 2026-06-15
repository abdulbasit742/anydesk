export type HeartbeatPing = { readonly kind: 'heartbeat.ping'; readonly pingId: string; readonly sentAtMs: number };
export type HeartbeatPong = { readonly kind: 'heartbeat.pong'; readonly pingId: string; readonly sentAtMs: number; readonly receivedAtMs: number; readonly repliedAtMs: number };
export type LatencySample = { readonly atMs: number; readonly rttMs: number };
export type ConnectionHealth = 'excellent' | 'good' | 'degraded' | 'poor' | 'offline';
