export interface SessionHealthInput {
  rttMs?: number;
  packetLossPercent?: number;
  reconnectCount: number;
  bitrateKbps?: number;
}

export type SessionHealthScore = "excellent" | "good" | "degraded" | "poor";

export function scoreSessionHealth(input: SessionHealthInput): SessionHealthScore {
  const rtt = input.rttMs ?? 0;
  const loss = input.packetLossPercent ?? 0;
  const bitrate = input.bitrateKbps ?? 9999;
  if (input.reconnectCount >= 5 || loss >= 8 || rtt >= 500 || bitrate < 200) return "poor";
  if (input.reconnectCount >= 2 || loss >= 3 || rtt >= 250 || bitrate < 800) return "degraded";
  if (loss >= 1 || rtt >= 120 || bitrate < 1500) return "good";
  return "excellent";
}
