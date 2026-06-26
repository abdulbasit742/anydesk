/**
 * Worker Agent IPC — Main Process
 *
 * Manages the lifecycle of the distributed computing worker agent.
 * The agent:
 *   1. Periodically collects hardware stats and reports them to the API
 *   2. Polls for assigned tasks and executes them (via child processes)
 *   3. Reports task progress and results back to the API
 *
 * IPC channels:
 *   worker:start   → Start the agent (requires token, nodeId, clusterId, apiBase)
 *   worker:stop    → Stop the agent
 *   worker:status  → Get current agent status
 */

import { ipcMain } from "electron";
import https from "node:https";
import http from "node:http";
import { URL } from "node:url";
import si from "systeminformation";

interface AgentConfig {
  token: string;
  nodeId: string;
  clusterId: string;
  apiBase: string;
}

interface AgentStatus {
  running: boolean;
  nodeId: string | null;
  clusterId: string | null;
  lastHeartbeatAt: number | null;
  lastError: string | null;
  activeTasks: number;
}

let agentConfig: AgentConfig | null = null;
let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
let taskPollInterval: ReturnType<typeof setInterval> | null = null;
let activeTasks = 0;
let lastHeartbeatAt: number | null = null;
let lastError: string | null = null;

// ─── HTTP helper ──────────────────────────────────────────────────────────────

async function apiRequest(
  method: string,
  path: string,
  body?: unknown
): Promise<{ ok: boolean; status: number; data: unknown }> {
  if (!agentConfig) throw new Error("Agent not configured");
  const url = new URL(path, agentConfig.apiBase);
  const isHttps = url.protocol === "https:";
  const lib = isHttps ? https : http;

  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : undefined;
    const req = lib.request(
      {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${agentConfig!.token}`,
          ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            resolve({ ok: (res.statusCode ?? 0) < 400, status: res.statusCode ?? 0, data: JSON.parse(raw) });
          } catch {
            resolve({ ok: (res.statusCode ?? 0) < 400, status: res.statusCode ?? 0, data: raw });
          }
        });
      }
    );
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ─── Telemetry collection ─────────────────────────────────────────────────────

async function collectAndReportTelemetry(): Promise<void> {
  if (!agentConfig) return;

  const [cpuLoad, mem, graphics, cpuTemp, networkStats] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.graphics().catch(() => ({ controllers: [] })),
    si.cpuTemperature().catch(() => ({ main: null })),
    si.networkStats().catch(() => []),
  ]);

  const ramTotalMb = mem.total / 1024 / 1024;
  const ramUsedMb = (mem.total - mem.available) / 1024 / 1024;

  const gpuControllers = (graphics as any).controllers ?? [];
  const gpu = gpuControllers[0] ?? null;

  const networkAgg = Array.isArray(networkStats)
    ? networkStats.reduce((a: any, i: any) => ({ rx: a.rx + (i.rx_bytes ?? 0), tx: a.tx + (i.tx_bytes ?? 0) }), { rx: 0, tx: 0 })
    : { rx: 0, tx: 0 };

  const payload = {
    nodeId: agentConfig.nodeId,
    cpuPercent: cpuLoad.currentLoad,
    ramPercent: (ramUsedMb / ramTotalMb) * 100,
    ramUsedMb,
    ramTotalMb,
    gpuPercent: gpu?.utilizationGpu ?? undefined,
    gpuVramUsedMb: gpu?.memoryUsed ?? undefined,
    gpuVramTotalMb: gpu?.memoryTotal ?? undefined,
    gpuTempC: gpu?.temperatureGpu ?? undefined,
    cpuTempC: typeof cpuTemp.main === "number" ? cpuTemp.main : undefined,
    networkUpKbps: networkAgg.tx / 1024,
    networkDownKbps: networkAgg.rx / 1024,
    activeTaskCount: activeTasks,
  };

  const result = await apiRequest(
    "POST",
    `/api/clusters/${agentConfig.clusterId}/telemetry`,
    payload
  );

  if (result.ok) {
    lastHeartbeatAt = Date.now();
    lastError = null;
  } else {
    lastError = `Telemetry failed: HTTP ${result.status}`;
  }
}

// ─── Task polling ─────────────────────────────────────────────────────────────

async function pollAndExecuteTasks(): Promise<void> {
  if (!agentConfig) return;

  const result = await apiRequest(
    "GET",
    `/api/clusters/${agentConfig.clusterId}/tasks?status=running`
  );

  if (!result.ok) return;
  const tasks = (result.data as any)?.tasks ?? [];

  for (const task of tasks) {
    if (task.assignedNodeId !== agentConfig.nodeId) continue;
    if (task.status !== "running") continue;

    // Simulate task execution (in production, spawn actual workload processes)
    activeTasks++;
    void executeTask(task);
  }
}

async function executeTask(task: { id: string; type: string; name: string; clusterId: string }): Promise<void> {
  if (!agentConfig) return;
  try {
    // Simulate work with progress updates
    for (let progress = 10; progress <= 90; progress += 10) {
      await new Promise((r) => setTimeout(r, 500));
      await apiRequest("PATCH", `/api/clusters/${task.clusterId}/tasks/${task.id}`, {
        status: "running",
        progressPercent: progress,
      });
    }

    await apiRequest("PATCH", `/api/clusters/${task.clusterId}/tasks/${task.id}`, {
      status: "completed",
      progressPercent: 100,
      result: { completedBy: agentConfig.nodeId, completedAt: new Date().toISOString() },
    });
  } catch (err) {
    await apiRequest("PATCH", `/api/clusters/${task.clusterId}/tasks/${task.id}`, {
      status: "failed",
      errorMessage: String(err),
    }).catch(() => {});
  } finally {
    activeTasks = Math.max(0, activeTasks - 1);
  }
}

// ─── IPC Registration ─────────────────────────────────────────────────────────

export function registerWorkerAgentIpc(): void {
  ipcMain.handle("worker:start", async (_event, config: AgentConfig) => {
    agentConfig = config;
    activeTasks = 0;
    lastError = null;

    // Heartbeat every 5 seconds
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    heartbeatInterval = setInterval(() => void collectAndReportTelemetry(), 5000);

    // Task poll every 3 seconds
    if (taskPollInterval) clearInterval(taskPollInterval);
    taskPollInterval = setInterval(() => void pollAndExecuteTasks(), 3000);

    // Immediate first heartbeat
    await collectAndReportTelemetry().catch(() => {});

    return { success: true };
  });

  ipcMain.handle("worker:stop", async () => {
    if (heartbeatInterval) { clearInterval(heartbeatInterval); heartbeatInterval = null; }
    if (taskPollInterval) { clearInterval(taskPollInterval); taskPollInterval = null; }
    agentConfig = null;
    return { success: true };
  });

  ipcMain.handle("worker:status", async (): Promise<AgentStatus> => ({
    running: agentConfig !== null,
    nodeId: agentConfig?.nodeId ?? null,
    clusterId: agentConfig?.clusterId ?? null,
    lastHeartbeatAt,
    lastError,
    activeTasks,
  }));
}
