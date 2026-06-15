import type { WebRtcQuality, WebRtcStatsSnapshot } from './webrtcStatsTypes.js';

export type MinimalRtcStatsReport = Iterable<{ readonly type: string; readonly [key: string]: unknown }>;

function numberField(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export function mapRtcStatsReport(sessionId: string, report: MinimalRtcStatsReport, collectedAtMs: number): WebRtcStatsSnapshot {
  let packetsLost = 0;
  let packetsSent = 0;
  let packetsReceived = 0;
  let bytesSent = 0;
  let bytesReceived = 0;
  let rttMs: number | null = null;
  let availableOutgoingBitrate: number | undefined;
  let currentRoundTripTime: number | undefined;

  for (const stat of report) {
    if (stat.type === 'outbound-rtp') {
      packetsSent += numberField(stat.packetsSent);
      bytesSent += numberField(stat.bytesSent);
    }
    if (stat.type === 'inbound-rtp') {
      packetsLost += numberField(stat.packetsLost);
      packetsReceived += numberField(stat.packetsReceived);
      bytesReceived += numberField(stat.bytesReceived);
    }
    if (stat.type === 'candidate-pair' && stat.state === 'succeeded') {
      currentRoundTripTime = numberField(stat.currentRoundTripTime);
      availableOutgoingBitrate = numberField(stat.availableOutgoingBitrate) || undefined;
      rttMs = currentRoundTripTime > 0 ? currentRoundTripTime * 1000 : rttMs;
    }
  }

  return { sessionId, collectedAtMs, rttMs, packetsLost, packetsSent, packetsReceived, bytesSent, bytesReceived, availableOutgoingBitrate, currentRoundTripTime };
}

export function classifyWebRtcQuality(snapshot: WebRtcStatsSnapshot): WebRtcQuality {
  if (snapshot.rttMs === null) return 'unknown';
  const totalPackets = snapshot.packetsReceived + snapshot.packetsLost;
  const lossRatio = totalPackets <= 0 ? 0 : snapshot.packetsLost / totalPackets;
  if (snapshot.rttMs < 80 && lossRatio < 0.01) return 'excellent';
  if (snapshot.rttMs < 180 && lossRatio < 0.03) return 'good';
  if (snapshot.rttMs < 350 && lossRatio < 0.08) return 'degraded';
  return 'poor';
}
