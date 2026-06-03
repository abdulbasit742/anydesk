// TelemetryMiddleware.js — Intercepts store actions to log metrics
const metrics = {
  broadcastRates: [],
  creditsDepletion: [],
  latency: [],
};

export function telemetryMiddleware() {
  return next => action => {
    const start = performance.now();
    const result = next(action);
    const duration = performance.now() - start;

    if (action.type?.startsWith('BROADCAST')) {
      metrics.broadcastRates.push({ action: action.type, ts: Date.now(), duration });
    }
    if (action.type?.startsWith('CREDITS')) {
      metrics.creditsDepletion.push({ amount: action.payload?.amount, ts: Date.now() });
    }
    metrics.latency.push({ action: action.type, duration, ts: Date.now() });

    // Keep only last 200 entries per metric
    if (metrics.latency.length > 200) metrics.latency.shift();
    if (metrics.broadcastRates.length > 200) metrics.broadcastRates.shift();
    if (metrics.creditsDepletion.length > 200) metrics.creditsDepletion.shift();

    return result;
  };
}

export function getMetrics() {
  return { ...metrics };
}

export function getAverageLatency() {
  if (!metrics.latency.length) return 0;
  return metrics.latency.reduce((acc, m) => acc + m.duration, 0) / metrics.latency.length;
}

export function clearMetrics() {
  metrics.broadcastRates = [];
  metrics.creditsDepletion = [];
  metrics.latency = [];
}
