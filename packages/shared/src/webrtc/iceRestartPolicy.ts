import type { WebRtcQuality } from './webrtcStatsTypes.js';

export type IceRestartDecision = { readonly restart: true; readonly reason: string } | { readonly restart: false; readonly reason: string };

export function shouldRequestIceRestart(input: {
  readonly connectionState: RTCPeerConnectionState | 'unknown';
  readonly iceConnectionState: RTCIceConnectionState | 'unknown';
  readonly quality: WebRtcQuality;
  readonly lastRestartAtMs?: number;
  readonly nowMs: number;
  readonly minRestartIntervalMs: number;
}): IceRestartDecision {
  if (input.lastRestartAtMs && input.nowMs - input.lastRestartAtMs < input.minRestartIntervalMs) {
    return { restart: false, reason: 'restart cooldown active' };
  }
  if (input.connectionState === 'failed' || input.iceConnectionState === 'failed') {
    return { restart: true, reason: 'peer connection failed' };
  }
  if (input.iceConnectionState === 'disconnected' && input.quality === 'poor') {
    return { restart: true, reason: 'ice disconnected with poor quality' };
  }
  return { restart: false, reason: 'connection within restart policy' };
}
