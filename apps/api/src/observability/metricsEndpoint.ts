/**
 * GET /api/ops/metrics
 * Returns safe operational metrics. RBAC: owner/admin only.
 * No secrets, no payloads, no private content.
 */

import type { Request, Response } from "express";
import { getTimingBuffer } from "../middleware/requestTiming.js";
import { getSocketMetrics } from "../socket/socketMetrics.js";

const startedAt = Date.now();

export function opsMetricsHandler(_req: Request, res: Response): void {
  const timings = getTimingBuffer();
  const totalRequests = timings.length;
  const avgLatency =
    totalRequests > 0
      ? Math.round(timings.reduce((sum, t) => sum + t.durationMs, 0) / totalRequests)
      : 0;

  // Calculate p95 latency
  const sorted = [...timings].sort((a, b) => a.durationMs - b.durationMs);
  const p95Index = Math.floor(sorted.length * 0.95);
  const p95Latency = sorted[p95Index]?.durationMs ?? 0;

  // Error rate
  const errors = timings.filter((t) => t.statusCode >= 400);
  const errorRate = totalRequests > 0 ? +(errors.length / totalRequests).toFixed(4) : 0;

  // Top slow routes
  const routeLatencies = new Map<string, number[]>();
  for (const t of timings) {
    const key = `${t.method} ${t.routePattern}`;
    const arr = routeLatencies.get(key) ?? [];
    arr.push(t.durationMs);
    routeLatencies.set(key, arr);
  }
  const topSlowRoutes = [...routeLatencies.entries()]
    .map(([route, durations]) => ({
      route,
      avgMs: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
    }))
    .sort((a, b) => b.avgMs - a.avgMs)
    .slice(0, 10);

  // Top error routes
  const routeErrors = new Map<string, number>();
  for (const t of errors) {
    const key = `${t.method} ${t.routePattern}`;
    routeErrors.set(key, (routeErrors.get(key) ?? 0) + 1);
  }
  const topErrorRoutes = [...routeErrors.entries()]
    .map(([route, count]) => ({ route, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const socketMetrics = getSocketMetrics();

  res.json({
    requestCount: totalRequests,
    averageLatencyMs: avgLatency,
    p95LatencyMs: p95Latency,
    errorRate,
    topSlowRoutes,
    topErrorRoutes,
    activeSocketConnections: socketMetrics.activeConnections,
    activeSessions: socketMetrics.sessionRooms,
    deviceHeartbeatStatus: { healthy: 0, degraded: 0, disconnected: 0 },
    degradedSessions: 0,
    queueStatus: { pending: 0, running: 0, failed: 0 },
    uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
  });
}
