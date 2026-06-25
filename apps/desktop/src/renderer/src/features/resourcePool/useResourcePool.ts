/**
 * useResourcePool — React hook for the distributed computing resource pool.
 *
 * Manages:
 *  - Live hardware stats (CPU, RAM, GPU, temperature, network)
 *  - Cluster API interactions (create, join, leave, list)
 *  - Worker agent lifecycle (start/stop)
 *  - Task submission and monitoring
 */

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HardwareStats {
  cpuPercent: number;
  ramPercent: number;
  ramUsedMb: number;
  ramTotalMb: number;
  gpuPercent: number | null;
  gpuVramUsedMb: number | null;
  gpuVramTotalMb: number | null;
  gpuTempC: number | null;
  cpuTempC: number | null;
  networkUpKbps: number;
  networkDownKbps: number;
  platform: string;
  hostname: string;
  collectedAt: number;
}

export interface ClusterNode {
  id: string;
  clusterId: string;
  deviceId: string;
  userId: string;
  nickname: string | null;
  status: string;
  cpuShareLimit: number;
  ramShareLimit: number;
  gpuShareLimit: number;
  priorityLevel: number;
  lastHeartbeatAt: string | null;
  joinedAt: string;
  latestTelemetry?: {
    cpuPercent: number;
    ramPercent: number;
    ramUsedMb: number;
    ramTotalMb: number;
    gpuPercent: number | null;
    networkUpKbps: number;
    networkDownKbps: number;
    activeTaskCount: number;
    recordedAt: string;
  } | null;
}

export interface Cluster {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  status: string;
  inviteCode: string;
  maxNodes: number;
  nodeCount: number;
  onlineNodeCount: number;
  createdAt: string;
}

export interface DistributedTask {
  id: string;
  clusterId: string;
  type: string;
  status: string;
  priority: number;
  name: string;
  description: string | null;
  progressPercent: number;
  estimatedSeconds: number | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface WorkerAgentStatus {
  running: boolean;
  nodeId: string | null;
  clusterId: string | null;
  lastHeartbeatAt: number | null;
  lastError: string | null;
  activeTasks: number;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useResourcePool(apiBase: string, token: string) {
  const [stats, setStats] = useState<HardwareStats | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [nodes, setNodes] = useState<ClusterNode[]>([]);
  const [tasks, setTasks] = useState<DistributedTask[]>([]);
  const [agentStatus, setAgentStatus] = useState<WorkerAgentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stopPollRef = useRef<(() => void) | null>(null);

  // ── Hardware stats polling ──────────────────────────────────────────────────

  useEffect(() => {
    const rp = (window as any).resourcePool;
    if (!rp) return;

    rp.startPoll(5000).catch(() => {});
    const unsub = rp.onStatsUpdate((s: HardwareStats) => setStats(s));

    // Initial fetch
    rp.getStats().then((r: any) => { if (r.success) setStats(r.stats); }).catch(() => {});

    return () => {
      if (typeof unsub === "function") unsub();
      rp.stopPoll().catch(() => {});
    };
  }, []);

  // ── Agent status polling ────────────────────────────────────────────────────

  useEffect(() => {
    const rp = (window as any).resourcePool;
    if (!rp) return;
    const iv = setInterval(async () => {
      const status = await rp.getAgentStatus().catch(() => null);
      if (status) setAgentStatus(status);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  // ── API helpers ─────────────────────────────────────────────────────────────

  const apiFetch = useCallback(
    async (method: string, path: string, body?: unknown) => {
      const res = await fetch(`${apiBase}${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error ?? "Request failed");
      }
      return res.json();
    },
    [apiBase, token]
  );

  // ── Cluster operations ──────────────────────────────────────────────────────

  const loadClusters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("GET", "/api/clusters");
      setClusters(data.clusters ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  const createCluster = useCallback(
    async (name: string, description?: string) => {
      const data = await apiFetch("POST", "/api/clusters", { name, description });
      await loadClusters();
      return data.cluster as Cluster;
    },
    [apiFetch, loadClusters]
  );

  const joinCluster = useCallback(
    async (inviteCode: string, deviceId: string, nickname?: string) => {
      const data = await apiFetch("POST", "/api/clusters/join", { inviteCode, deviceId, nickname });
      await loadClusters();
      return data.node as ClusterNode;
    },
    [apiFetch, loadClusters]
  );

  const selectCluster = useCallback(
    async (cluster: Cluster) => {
      setSelectedCluster(cluster);
      setLoading(true);
      try {
        const data = await apiFetch("GET", `/api/clusters/${cluster.id}`);
        setNodes(data.nodes ?? []);
        const taskData = await apiFetch("GET", `/api/clusters/${cluster.id}/tasks`);
        setTasks(taskData.tasks ?? []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [apiFetch]
  );

  const leaveCluster = useCallback(
    async (clusterId: string, nodeId: string) => {
      await apiFetch("DELETE", `/api/clusters/${clusterId}/nodes/${nodeId}`);
      await loadClusters();
      if (selectedCluster?.id === clusterId) {
        setSelectedCluster(null);
        setNodes([]);
        setTasks([]);
      }
    },
    [apiFetch, loadClusters, selectedCluster]
  );

  const updateNodeLimits = useCallback(
    async (clusterId: string, nodeId: string, limits: { cpuShareLimit?: number; ramShareLimit?: number; gpuShareLimit?: number; priorityLevel?: number }) => {
      await apiFetch("PATCH", `/api/clusters/${clusterId}/nodes/${nodeId}`, limits);
      if (selectedCluster?.id === clusterId) await selectCluster(selectedCluster);
    },
    [apiFetch, selectedCluster, selectCluster]
  );

  // ── Task operations ─────────────────────────────────────────────────────────

  const submitTask = useCallback(
    async (clusterId: string, task: { name: string; type: string; priority?: number; description?: string; payload?: Record<string, unknown> }) => {
      const data = await apiFetch("POST", `/api/clusters/${clusterId}/tasks`, { ...task, clusterId });
      if (selectedCluster?.id === clusterId) {
        setTasks((prev) => [data.task, ...prev]);
      }
      return data.task as DistributedTask;
    },
    [apiFetch, selectedCluster]
  );

  // ── Worker agent ────────────────────────────────────────────────────────────

  const startAgent = useCallback(
    async (nodeId: string, clusterId: string) => {
      const rp = (window as any).resourcePool;
      if (!rp) throw new Error("Resource pool API not available");
      await rp.startAgent({ token, nodeId, clusterId, apiBase });
      const status = await rp.getAgentStatus();
      setAgentStatus(status);
    },
    [token, apiBase]
  );

  const stopAgent = useCallback(async () => {
    const rp = (window as any).resourcePool;
    if (!rp) return;
    await rp.stopAgent();
    const status = await rp.getAgentStatus();
    setAgentStatus(status);
  }, []);

  // ── Initial load ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (token) void loadClusters();
  }, [token, loadClusters]);

  return {
    stats,
    clusters,
    selectedCluster,
    nodes,
    tasks,
    agentStatus,
    loading,
    error,
    loadClusters,
    createCluster,
    joinCluster,
    selectCluster,
    leaveCluster,
    updateNodeLimits,
    submitTask,
    startAgent,
    stopAgent,
  };
}
