export type WebRtcQualityLabel = "unknown" | "good" | "fair" | "poor";

export interface WebRtcQualitySnapshot {
  timestamp: number;
  connectionState: RTCPeerConnectionState;
  iceConnectionState: RTCIceConnectionState;
  signalingState: RTCSignalingState;
  rttMs: number | null;
  packetsLost: number;
  framesPerSecond: number | null;
  bytesReceived: number;
  bytesSent: number;
  availableOutgoingBitrate: number | null;
  candidatePairState: string | null;
  localCandidateType: string | null;
  remoteCandidateType: string | null;
}

type StatsRecord = RTCStats & Record<string, unknown>;

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function findReport(stats: RTCStatsReport, id: unknown): StatsRecord | null {
  if (typeof id !== "string") return null;
  return (stats.get(id) as StatsRecord | undefined) ?? null;
}

export async function collectWebRtcStats(peer: RTCPeerConnection): Promise<WebRtcQualitySnapshot> {
  const report = await peer.getStats();
  let selectedPair: StatsRecord | null = null;
  let packetsLost = 0;
  let framesPerSecond: number | null = null;
  let bytesReceived = 0;
  let bytesSent = 0;

  report.forEach((raw) => {
    const item = raw as StatsRecord;

    if (item.type === "candidate-pair" && (item.selected === true || item.nominated === true)) {
      selectedPair = item;
    }

    if (item.type === "transport") {
      const pair = findReport(report, item.selectedCandidatePairId);
      if (pair) selectedPair = pair;
    }

    if (item.type === "inbound-rtp" && item.kind === "video") {
      packetsLost += asNumber(item.packetsLost) ?? 0;
      framesPerSecond = asNumber(item.framesPerSecond) ?? framesPerSecond;
      bytesReceived += asNumber(item.bytesReceived) ?? 0;
    }

    if (item.type === "outbound-rtp" && item.kind === "video") {
      bytesSent += asNumber(item.bytesSent) ?? 0;
    }
  });

  const rttSeconds = selectedPair ? asNumber(selectedPair.currentRoundTripTime) : null;
  const localCandidate = selectedPair ? findReport(report, selectedPair.localCandidateId) : null;
  const remoteCandidate = selectedPair ? findReport(report, selectedPair.remoteCandidateId) : null;

  return {
    timestamp: Date.now(),
    connectionState: peer.connectionState,
    iceConnectionState: peer.iceConnectionState,
    signalingState: peer.signalingState,
    rttMs: rttSeconds === null ? null : Math.round(rttSeconds * 1000),
    packetsLost,
    framesPerSecond,
    bytesReceived,
    bytesSent,
    availableOutgoingBitrate: selectedPair ? asNumber(selectedPair.availableOutgoingBitrate) : null,
    candidatePairState: selectedPair ? asString(selectedPair.state) : null,
    localCandidateType: localCandidate ? asString(localCandidate.candidateType) : null,
    remoteCandidateType: remoteCandidate ? asString(remoteCandidate.candidateType) : null
  };
}

export function formatQualityLabel(snapshot: WebRtcQualitySnapshot | null): WebRtcQualityLabel {
  if (!snapshot || snapshot.connectionState === "new" || snapshot.connectionState === "connecting") {
    return "unknown";
  }

  if (snapshot.connectionState === "failed" || snapshot.iceConnectionState === "failed") {
    return "poor";
  }

  const rtt = snapshot.rttMs ?? 0;
  const loss = snapshot.packetsLost;

  if (rtt >= 350 || loss >= 50) return "poor";
  if (rtt >= 180 || loss >= 10) return "fair";
  return "good";
}
