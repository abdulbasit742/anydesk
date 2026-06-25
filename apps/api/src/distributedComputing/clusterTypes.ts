import { z } from "zod";

// ─── Cluster Management ───────────────────────────────────────────────────────

export const createClusterInput = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(500).optional(),
  maxNodes: z.number().int().min(2).max(20).optional().default(5),
});

export const updateClusterInput = z.object({
  name: z.string().min(2).max(80).optional(),
  description: z.string().max(500).optional(),
  maxNodes: z.number().int().min(2).max(20).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const joinClusterInput = z.object({
  inviteCode: z.string().uuid(),
  deviceId: z.string().uuid(),
  nickname: z.string().max(60).optional(),
});

// ─── Node Resource Limits ─────────────────────────────────────────────────────

export const updateNodeLimitsInput = z.object({
  cpuShareLimit: z.number().min(0.1).max(1.0).optional(),
  ramShareLimit: z.number().min(0.1).max(1.0).optional(),
  gpuShareLimit: z.number().min(0.0).max(1.0).optional(),
  priorityLevel: z.number().int().min(1).max(10).optional(),
  nickname: z.string().max(60).optional(),
});

// ─── Telemetry ────────────────────────────────────────────────────────────────

export const telemetryInput = z.object({
  nodeId: z.string().uuid(),
  cpuPercent: z.number().min(0).max(100),
  ramPercent: z.number().min(0).max(100),
  ramUsedMb: z.number().min(0),
  ramTotalMb: z.number().min(0),
  gpuPercent: z.number().min(0).max(100).optional(),
  gpuVramUsedMb: z.number().min(0).optional(),
  gpuVramTotalMb: z.number().min(0).optional(),
  gpuTempC: z.number().optional(),
  cpuTempC: z.number().optional(),
  networkUpKbps: z.number().min(0).optional().default(0),
  networkDownKbps: z.number().min(0).optional().default(0),
  activeTaskCount: z.number().int().min(0).optional().default(0),
});

export type TelemetryPayload = z.infer<typeof telemetryInput>;

// ─── Task Submission ──────────────────────────────────────────────────────────

export const submitTaskInput = z.object({
  clusterId: z.string().uuid(),
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  type: z.enum(["video_render", "ai_inference", "compilation", "game_stream", "scientific_compute", "custom"]),
  priority: z.number().int().min(1).max(10).optional().default(5),
  payload: z.record(z.unknown()).optional(),
  estimatedSeconds: z.number().int().min(1).optional(),
});

export const updateTaskStatusInput = z.object({
  status: z.enum(["running", "completed", "failed", "canceled"]),
  progressPercent: z.number().min(0).max(100).optional(),
  result: z.record(z.unknown()).optional(),
  errorMessage: z.string().max(1000).optional(),
});

// ─── Serialized Cluster Response ──────────────────────────────────────────────

export interface SerializedCluster {
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

export interface SerializedNode {
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
  latestTelemetry?: SerializedTelemetry | null;
}

export interface SerializedTelemetry {
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
  activeTaskCount: number;
  recordedAt: string;
}

export interface SerializedTask {
  id: string;
  clusterId: string;
  submittedByUserId: string;
  assignedNodeId: string | null;
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
