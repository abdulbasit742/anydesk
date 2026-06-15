export type WebRtcStatsSnapshot = {
  readonly sessionId: string;
  readonly collectedAtMs: number;
  readonly rttMs: number | null;
  readonly packetsLost: number;
  readonly packetsSent: number;
  readonly packetsReceived: number;
  readonly bytesSent: number;
  readonly bytesReceived: number;
  readonly availableOutgoingBitrate?: number;
  readonly currentRoundTripTime?: number;
};

export type WebRtcQuality = 'excellent' | 'good' | 'degraded' | 'poor' | 'unknown';
