/**
 * WebRTC quality observability.
 * Collects metadata only — never screen frames, audio, video, SDP, ICE candidates, or TURN credentials.
 */

export interface WebRTCQualitySnapshot {
  sessionId: string;
  connectionState: string;
  iceState: string;
  signalingState: string;
  reconnectAttempts: number;
  packetLossPercent?: number;
  bitrateKbps?: number;
  frameRate?: number;
  resolutionWidth?: number;
  resolutionHeight?: number;
  latencyMs?: number;
  timestamp: string;
}

export type QualityRating = "good" | "fair" | "poor" | "failed";

const qualityBuffer: WebRTCQualitySnapshot[] = [];
const MAX_BUFFER = 500;

export function recordQualitySnapshot(snapshot: WebRTCQualitySnapshot): void {
  if (qualityBuffer.length >= MAX_BUFFER) {
    qualityBuffer.shift();
  }
  qualityBuffer.push(snapshot);
}

export function rateQuality(snapshot: WebRTCQualitySnapshot): QualityRating {
  if (snapshot.connectionState === "failed") return "failed";
  if ((snapshot.packetLossPercent ?? 0) > 10) return "poor";
  if ((snapshot.packetLossPercent ?? 0) > 3) return "fair";
  if ((snapshot.latencyMs ?? 0) > 300) return "poor";
  if ((snapshot.latencyMs ?? 0) > 150) return "fair";
  return "good";
}

export function getQualityAggregation() {
  const byQuality: Record<QualityRating, number> = { good: 0, fair: 0, poor: 0, failed: 0 };
  const failedReasons: Record<string, number> = {};
  let totalSetupTime = 0;
  let setupCount = 0;
  let iceFailures = 0;
  let reconnects = 0;

  for (const snap of qualityBuffer) {
    const rating = rateQuality(snap);
    byQuality[rating]++;

    if (snap.connectionState === "failed") {
      const reason = snap.iceState === "failed" ? "ice_failure" : "connection_failure";
      failedReasons[reason] = (failedReasons[reason] ?? 0) + 1;
    }

    if (snap.iceState === "failed") iceFailures++;
    reconnects += snap.reconnectAttempts;
  }

  return {
    sessionsByQuality: byQuality,
    failedSessionsByReason: failedReasons,
    averageConnectionSetupTimeMs: setupCount > 0 ? Math.round(totalSetupTime / setupCount) : null,
    iceFailureRate:
      qualityBuffer.length > 0 ? +(iceFailures / qualityBuffer.length).toFixed(4) : 0,
    reconnectRate:
      qualityBuffer.length > 0 ? +(reconnects / qualityBuffer.length).toFixed(4) : 0,
    totalSnapshots: qualityBuffer.length,
    timestamp: new Date().toISOString(),
  };
}

export function getReliabilityRecommendations(
  snapshot: WebRTCQualitySnapshot
): string[] {
  const recommendations: string[] = [];

  if (snapshot.iceState === "failed") {
    recommendations.push("TURN server required — direct connection failed");
  }
  if ((snapshot.packetLossPercent ?? 0) > 10) {
    recommendations.push("Host network unstable — high packet loss detected");
  }
  if ((snapshot.latencyMs ?? 0) > 300) {
    recommendations.push("Viewer network unstable — high latency detected");
  }
  if (snapshot.connectionState === "disconnected") {
    recommendations.push("Socket disconnected — check network connectivity");
  }
  if (snapshot.reconnectAttempts > 3) {
    recommendations.push("Device heartbeat degraded — excessive reconnect attempts");
  }

  return recommendations;
}
