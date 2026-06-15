export type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export interface QualityMetrics {
  bitrate: number;
  packetLoss: number;
  jitter: number;
  rtt: number;
  fps: number;
  resolution: { width: number; height: number };
}

export function computeQuality(metrics: QualityMetrics): ConnectionQuality {
  if (metrics.rtt > 500 || metrics.packetLoss > 10 || metrics.bitrate < 100_000) return 'critical';
  if (metrics.rtt > 300 || metrics.packetLoss > 5 || metrics.bitrate < 500_000) return 'poor';
  if (metrics.rtt > 150 || metrics.packetLoss > 2 || metrics.bitrate < 1_000_000) return 'fair';
  if (metrics.rtt > 80 || metrics.packetLoss > 0.5 || metrics.bitrate < 2_000_000) return 'good';
  return 'excellent';
}


