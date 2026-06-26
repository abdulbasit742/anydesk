/**
 * Resource Aggregator
 *
 * Computes cluster-wide aggregate statistics from the latest telemetry
 * of all online nodes. Used by the dashboard to show unified resource usage.
 */

import { prisma } from "../lib/prisma.js";

export interface ClusterAggregateStats {
  clusterId: string;
  totalNodes: number;
  onlineNodes: number;
  avgCpuPercent: number;
  avgRamPercent: number;
  totalRamUsedMb: number;
  totalRamTotalMb: number;
  avgGpuPercent: number | null;
  totalGpuVramUsedMb: number | null;
  totalGpuVramTotalMb: number | null;
  avgCpuTempC: number | null;
  avgGpuTempC: number | null;
  totalNetworkUpKbps: number;
  totalNetworkDownKbps: number;
  totalActiveTasks: number;
  pendingTasks: number;
  completedTasksToday: number;
  computedAt: string;
}

const STALE_TELEMETRY_MS = 60_000; // 60 seconds

export async function getClusterAggregateStats(clusterId: string): Promise<ClusterAggregateStats> {
  const nodes = await prisma.clusterNode.findMany({
    where: { clusterId },
    include: {
      telemetry: { orderBy: { recordedAt: "desc" }, take: 1 },
    },
  });

  const now = Date.now();
  const onlineNodes = nodes.filter(
    (n) => n.status === "online" || n.status === "idle" || n.status === "busy"
  );

  // Only include nodes with fresh telemetry
  const freshNodes = onlineNodes.filter((n) => {
    const t = n.telemetry[0];
    if (!t) return false;
    return now - new Date(t.recordedAt).getTime() < STALE_TELEMETRY_MS;
  });

  const telemetries = freshNodes.map((n) => n.telemetry[0]).filter(Boolean);

  const avg = (arr: number[]) => arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const avgNullable = (arr: (number | null | undefined)[]) => {
    const valid = arr.filter((v): v is number => v != null);
    return valid.length === 0 ? null : avg(valid);
  };
  const sumNullable = (arr: (number | null | undefined)[]) => {
    const valid = arr.filter((v): v is number => v != null);
    return valid.length === 0 ? null : sum(valid);
  };

  const [pendingTasks, completedTasksToday] = await Promise.all([
    prisma.distributedTask.count({
      where: { clusterId, status: { in: ["pending", "queued"] } },
    }),
    prisma.distributedTask.count({
      where: {
        clusterId,
        status: "completed",
        completedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  return {
    clusterId,
    totalNodes: nodes.length,
    onlineNodes: onlineNodes.length,
    avgCpuPercent: avg(telemetries.map((t) => t.cpuPercent)),
    avgRamPercent: avg(telemetries.map((t) => t.ramPercent)),
    totalRamUsedMb: sum(telemetries.map((t) => t.ramUsedMb)),
    totalRamTotalMb: sum(telemetries.map((t) => t.ramTotalMb)),
    avgGpuPercent: avgNullable(telemetries.map((t) => t.gpuPercent)),
    totalGpuVramUsedMb: sumNullable(telemetries.map((t) => t.gpuVramUsedMb)),
    totalGpuVramTotalMb: sumNullable(telemetries.map((t) => t.gpuVramTotalMb)),
    avgCpuTempC: avgNullable(telemetries.map((t) => t.cpuTempC)),
    avgGpuTempC: avgNullable(telemetries.map((t) => t.gpuTempC)),
    totalNetworkUpKbps: sum(telemetries.map((t) => t.networkUpKbps)),
    totalNetworkDownKbps: sum(telemetries.map((t) => t.networkDownKbps)),
    totalActiveTasks: sum(telemetries.map((t) => t.activeTaskCount)),
    pendingTasks,
    completedTasksToday,
    computedAt: new Date().toISOString(),
  };
}
