// NetworkLatencies.js — Simulates varying platform request delays, timeouts, and outages
const PLATFORM_PROFILES = {
  bolt: { base: 120, jitter: 80, outageRate: 0.02 },
  lovable: { base: 200, jitter: 150, outageRate: 0.03 },
  manus: { base: 350, jitter: 200, outageRate: 0.05 },
  replit: { base: 180, jitter: 100, outageRate: 0.03 },
  claude: { base: 800, jitter: 400, outageRate: 0.01 },
  v0: { base: 300, jitter: 120, outageRate: 0.02 },
};

export function simulateLatency(platformId, options = {}) {
  const profile = PLATFORM_PROFILES[platformId?.toLowerCase()] || { base: 250, jitter: 150, outageRate: 0.03 };
  const { forceTimeout = false, forceOutage = false } = options;

  if (forceOutage || Math.random() < profile.outageRate) {
    return { latencyMs: 0, status: 'outage', error: 'ECONNREFUSED' };
  }
  if (forceTimeout || Math.random() < 0.02) {
    return { latencyMs: 30000, status: 'timeout', error: 'ETIMEDOUT' };
  }

  const latencyMs = Math.round(profile.base + (Math.random() * 2 - 1) * profile.jitter);
  return { latencyMs: Math.max(10, latencyMs), status: 'ok', error: null };
}

export async function withSimulatedLatency(platformId, fn, options = {}) {
  const { latencyMs, status } = simulateLatency(platformId, options);

  if (status === 'outage') throw new Error(`[${platformId}] Connection refused`);
  if (status === 'timeout') {
    await new Promise(r => setTimeout(r, 5000));
    throw new Error(`[${platformId}] Request timed out`);
  }

  await new Promise(r => setTimeout(r, latencyMs));
  return fn();
}

export function getProfileSummary() {
  return Object.entries(PLATFORM_PROFILES).map(([id, p]) => ({
    id,
    avgLatency: p.base,
    maxJitter: p.jitter,
    outageRate: `${(p.outageRate * 100).toFixed(1)}%`,
  }));
}
