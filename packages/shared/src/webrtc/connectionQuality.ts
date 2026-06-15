import type { WebRtcQuality, WebRtcStatsSnapshot } from './webrtcStatsTypes.js';
import { classifyWebRtcQuality } from './webrtcStatsMapper.js';

export type ConnectionQualityPoint = { readonly atMs: number; readonly quality: WebRtcQuality; readonly rttMs: number | null; readonly lossRatio: number };

export function toConnectionQualityPoint(snapshot: WebRtcStatsSnapshot): ConnectionQualityPoint {
  const totalPackets = snapshot.packetsReceived + snapshot.packetsLost;
  return {
    atMs: snapshot.collectedAtMs,
    quality: classifyWebRtcQuality(snapshot),
    rttMs: snapshot.rttMs,
    lossRatio: totalPackets <= 0 ? 0 : snapshot.packetsLost / totalPackets,
  };
}

export function appendQualityPoint(history: readonly ConnectionQualityPoint[], point: ConnectionQualityPoint, maxPoints = 120): readonly ConnectionQualityPoint[] {
  return [...history, point].slice(-maxPoints);
}
