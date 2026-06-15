import { describe, it, expect } from "vitest";

interface QualityMetrics {
  fps: number;
  bitrate: number;
  packetLoss: number;
  jitter: number;
  rtt: number;
}

function assessQuality(metrics: QualityMetrics): "excellent" | "good" | "fair" | "poor" {
  if (metrics.packetLoss > 5 || metrics.rtt > 500) return "poor";
  if (metrics.packetLoss > 1 || metrics.rtt > 200 || metrics.fps < 15) return "fair";
  if (metrics.fps >= 30 && metrics.rtt < 50 && metrics.packetLoss < 0.5) return "excellent";
  return "good";
}

describe("WebRTC Quality Assessment", () => {
  it("rates excellent conditions", () => {
    expect(assessQuality({ fps: 60, bitrate: 5000000, packetLoss: 0, jitter: 5, rtt: 20 })).toBe("excellent");
  });

  it("rates good conditions", () => {
    expect(assessQuality({ fps: 30, bitrate: 2000000, packetLoss: 0.5, jitter: 15, rtt: 80 })).toBe("good");
  });

  it("rates fair with packet loss", () => {
    expect(assessQuality({ fps: 25, bitrate: 1000000, packetLoss: 2, jitter: 30, rtt: 150 })).toBe("fair");
  });

  it("rates poor with high loss", () => {
    expect(assessQuality({ fps: 10, bitrate: 500000, packetLoss: 8, jitter: 100, rtt: 600 })).toBe("poor");
  });

  it("rates poor with high latency", () => {
    expect(assessQuality({ fps: 30, bitrate: 2000000, packetLoss: 0, jitter: 10, rtt: 1000 })).toBe("poor");
  });

  it("rates fair with low fps", () => {
    expect(assessQuality({ fps: 10, bitrate: 2000000, packetLoss: 0, jitter: 10, rtt: 50 })).toBe("fair");
  });
});
