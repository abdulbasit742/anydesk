/**
 * Task Scheduler Service
 *
 * Implements an intelligent task distribution algorithm that assigns distributed
 * tasks to the best available worker node in a cluster based on:
 *   1. Node availability (status must be 'online' or 'idle')
 *   2. Resource headroom (CPU, RAM, GPU below share limits)
 *   3. Priority level (higher priority nodes get tasks first)
 *   4. Recency of telemetry (stale telemetry nodes are deprioritised)
 */

import { prisma } from "../lib/prisma.js";
import { logger } from "../observability/safeLogger.js";

const STALE_TELEMETRY_MS = 30_000; // 30 seconds

interface NodeScore {
  nodeId: string;
  score: number;
}

/**
 * Selects the best available node for a given task within a cluster.
 * Returns null if no suitable node is available.
 */
export async function selectBestNode(clusterId: string, taskType: string): Promise<string | null> {
  const nodes = await prisma.clusterNode.findMany({
    where: {
      clusterId,
      status: { in: ["online", "idle"] },
    },
    include: {
      telemetry: {
        orderBy: { recordedAt: "desc" },
        take: 1,
      },
    },
  });

  if (nodes.length === 0) return null;

  const now = Date.now();
  const scored: NodeScore[] = [];

  for (const node of nodes) {
    const latest = node.telemetry[0];
    if (!latest) continue;

    const telemetryAge = now - new Date(latest.recordedAt).getTime();
    if (telemetryAge > STALE_TELEMETRY_MS) continue; // skip stale nodes

    // Compute available headroom (0–1 scale, higher = more available)
    const cpuHeadroom = node.cpuShareLimit - latest.cpuPercent / 100;
    const ramHeadroom = node.ramShareLimit - latest.ramPercent / 100;

    // If node is over its share limit for CPU or RAM, skip it
    if (cpuHeadroom < 0 || ramHeadroom < 0) continue;

    // For GPU-intensive tasks, require GPU headroom
    const requiresGpu = ["ai_inference", "video_render", "game_stream"].includes(taskType);
    if (requiresGpu) {
      if (latest.gpuPercent == null) continue; // no GPU available
      const gpuHeadroom = node.gpuShareLimit - (latest.gpuPercent ?? 0) / 100;
      if (gpuHeadroom < 0) continue;
    }

    // Score = weighted combination of headroom + priority
    const headroomScore = (cpuHeadroom * 0.4 + ramHeadroom * 0.4);
    const priorityBonus = node.priorityLevel / 10 * 0.2;
    const score = headroomScore + priorityBonus;

    scored.push({ nodeId: node.id, score });
  }

  if (scored.length === 0) return null;

  // Return the node with the highest score
  scored.sort((a, b) => b.score - a.score);
  return scored[0].nodeId;
}

/**
 * Attempts to schedule all pending tasks in a cluster.
 * Called periodically or when new telemetry arrives.
 */
export async function schedulePendingTasks(clusterId: string): Promise<void> {
  const pendingTasks = await prisma.distributedTask.findMany({
    where: {
      clusterId,
      status: { in: ["pending", "queued"] },
      assignedNodeId: null,
    },
    orderBy: [
      { priority: "desc" },
      { createdAt: "asc" },
    ],
    take: 20,
  });

  for (const task of pendingTasks) {
    const nodeId = await selectBestNode(clusterId, task.type);
    if (!nodeId) {
      // No node available right now — mark as queued if not already
      if (task.status !== "queued") {
        await prisma.distributedTask.update({
          where: { id: task.id },
          data: { status: "queued" },
        });
      }
      continue;
    }

    await prisma.distributedTask.update({
      where: { id: task.id },
      data: {
        assignedNodeId: nodeId,
        status: "running",
        startedAt: new Date(),
      },
    });

    await prisma.clusterNode.update({
      where: { id: nodeId },
      data: { status: "busy" },
    });

    logger.info("Task scheduled", {
      event: "distributed_computing.task_scheduled",
      taskId: task.id,
      taskType: task.type,
      nodeId,
      clusterId,
    });
  }
}

/**
 * Marks a node as idle/online after a task completes, then reschedules.
 */
export async function onTaskComplete(taskId: string): Promise<void> {
  const task = await prisma.distributedTask.findUnique({
    where: { id: taskId },
    select: { assignedNodeId: true, clusterId: true },
  });
  if (!task?.assignedNodeId) return;

  // Check if the node has other running tasks
  const otherRunning = await prisma.distributedTask.count({
    where: {
      assignedNodeId: task.assignedNodeId,
      status: "running",
      id: { not: taskId },
    },
  });

  if (otherRunning === 0) {
    await prisma.clusterNode.update({
      where: { id: task.assignedNodeId },
      data: { status: "online" },
    });
  }

  // Attempt to schedule any waiting tasks
  await schedulePendingTasks(task.clusterId);
}
