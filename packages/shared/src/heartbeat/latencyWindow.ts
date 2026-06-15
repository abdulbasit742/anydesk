import type { ConnectionHealth, LatencySample } from './heartbeatTypes.js';

export function appendLatencySample(samples: readonly LatencySample[], sample: LatencySample, maxSamples = 60): readonly LatencySample[] {
  return [...samples, sample].slice(-maxSamples);
}

export function averageLatencyMs(samples: readonly LatencySample[]): number | null {
  if (samples.length === 0) return null;
  return samples.reduce((sum, sample) => sum + sample.rttMs, 0) / samples.length;
}

export function classifyConnectionHealth(samples: readonly LatencySample[], lastSeenAtMs: number | null, nowMs: number): ConnectionHealth {
  if (lastSeenAtMs === null || nowMs - lastSeenAtMs > 15000) return 'offline';
  const average = averageLatencyMs(samples);
  if (average === null) return 'good';
  if (average < 75) return 'excellent';
  if (average < 175) return 'good';
  if (average < 350) return 'degraded';
  return 'poor';
}
