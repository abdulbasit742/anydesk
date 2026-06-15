export interface WebRtcDiagnosticsSample {
  at: number;
  rttMs: number | null;
  packetsLost: number;
  packetsReceived: number;
  inboundBitrateBps: number | null;
  outboundBitrateBps: number | null;
  candidatePairState?: string;
  localCandidateType?: string;
  remoteCandidateType?: string;
}

export async function collectWebRtcDiagnostics(peer: RTCPeerConnection): Promise<WebRtcDiagnosticsSample> {
  const stats = await peer.getStats();
  let rttMs: number | null = null;
  let packetsLost = 0;
  let packetsReceived = 0;
  let inboundBitrateBps: number | null = null;
  let outboundBitrateBps: number | null = null;
  let candidatePairState: string | undefined;
  let localCandidateType: string | undefined;
  let remoteCandidateType: string | undefined;

  stats.forEach((report) => {
    if (report.type === 'candidate-pair' && report.state === 'succeeded') {
      rttMs = typeof report.currentRoundTripTime === 'number' ? report.currentRoundTripTime * 1000 : rttMs;
      candidatePairState = report.state;
    }
    if (report.type === 'inbound-rtp' && !report.isRemote) {
      packetsLost += Number(report.packetsLost ?? 0);
      packetsReceived += Number(report.packetsReceived ?? 0);
      inboundBitrateBps = typeof report.bytesReceived === 'number' ? report.bytesReceived * 8 : inboundBitrateBps;
    }
    if (report.type === 'outbound-rtp' && !report.isRemote) {
      outboundBitrateBps = typeof report.bytesSent === 'number' ? report.bytesSent * 8 : outboundBitrateBps;
    }
    if (report.type === 'local-candidate') localCandidateType = report.candidateType;
    if (report.type === 'remote-candidate') remoteCandidateType = report.candidateType;
  });

  return { at: Date.now(), rttMs, packetsLost, packetsReceived, inboundBitrateBps, outboundBitrateBps, candidatePairState, localCandidateType, remoteCandidateType };
}

export function packetLossPercent(sample: WebRtcDiagnosticsSample): number {
  const total = sample.packetsLost + sample.packetsReceived;
  return total <= 0 ? 0 : (sample.packetsLost / total) * 100;
}

export function summarizeDiagnostics(sample: WebRtcDiagnosticsSample): string {
  return `RTT ${sample.rttMs?.toFixed(0) ?? 'n/a'}ms · loss ${packetLossPercent(sample).toFixed(1)}% · ICE ${sample.candidatePairState ?? 'unknown'} · local ${sample.localCandidateType ?? 'n/a'} → remote ${sample.remoteCandidateType ?? 'n/a'}`;
}
