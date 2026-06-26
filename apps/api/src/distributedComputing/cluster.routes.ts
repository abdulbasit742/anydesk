/**
 * Distributed Computing — Cluster Management Routes
 *
 * Endpoints:
 *   POST   /api/clusters                          Create a new cluster
 *   GET    /api/clusters                          List clusters for the authenticated user
 *   GET    /api/clusters/:clusterId               Get cluster details with nodes
 *   PATCH  /api/clusters/:clusterId               Update cluster settings
 *   DELETE /api/clusters/:clusterId               Delete cluster (owner only)
 *   POST   /api/clusters/join                     Join a cluster via invite code
 *   DELETE /api/clusters/:clusterId/nodes/:nodeId Leave/remove a node
 *   PATCH  /api/clusters/:clusterId/nodes/:nodeId Update node resource limits
 *   POST   /api/clusters/:clusterId/telemetry     Submit node telemetry (heartbeat)
 *   GET    /api/clusters/:clusterId/telemetry     Get latest telemetry for all nodes
 *   POST   /api/clusters/:clusterId/tasks         Submit a distributed task
 *   GET    /api/clusters/:clusterId/tasks         List tasks in a cluster
 *   PATCH  /api/clusters/:clusterId/tasks/:taskId Update task status (from worker agent)
 */

import { Router } from "express";
import crypto from "node:crypto";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  createClusterInput,
  updateClusterInput,
  joinClusterInput,
  updateNodeLimitsInput,
  telemetryInput,
  submitTaskInput,
  updateTaskStatusInput,
  type SerializedCluster,
  type SerializedNode,
  type SerializedTask,
} from "./clusterTypes.js";
import { schedulePendingTasks, onTaskComplete } from "./taskScheduler.js";

const router = Router();
router.use(requireAuth);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function serializeCluster(cluster: any, nodes: any[] = []): SerializedCluster {
  return {
    id: cluster.id,
    name: cluster.name,
    description: cluster.description,
    ownerId: cluster.ownerId,
    status: cluster.status,
    inviteCode: cluster.inviteCode,
    maxNodes: cluster.maxNodes,
    nodeCount: nodes.length,
    onlineNodeCount: nodes.filter((n) => n.status === "online" || n.status === "idle" || n.status === "busy").length,
    createdAt: cluster.createdAt.toISOString(),
  };
}

function serializeNode(node: any): SerializedNode {
  const latest = node.telemetry?.[0] ?? null;
  return {
    id: node.id,
    clusterId: node.clusterId,
    deviceId: node.deviceId,
    userId: node.userId,
    nickname: node.nickname,
    status: node.status,
    cpuShareLimit: node.cpuShareLimit,
    ramShareLimit: node.ramShareLimit,
    gpuShareLimit: node.gpuShareLimit,
    priorityLevel: node.priorityLevel,
    lastHeartbeatAt: node.lastHeartbeatAt?.toISOString() ?? null,
    joinedAt: node.joinedAt.toISOString(),
    latestTelemetry: latest
      ? {
          cpuPercent: latest.cpuPercent,
          ramPercent: latest.ramPercent,
          ramUsedMb: latest.ramUsedMb,
          ramTotalMb: latest.ramTotalMb,
          gpuPercent: latest.gpuPercent,
          gpuVramUsedMb: latest.gpuVramUsedMb,
          gpuVramTotalMb: latest.gpuVramTotalMb,
          gpuTempC: latest.gpuTempC,
          cpuTempC: latest.cpuTempC,
          networkUpKbps: latest.networkUpKbps,
          networkDownKbps: latest.networkDownKbps,
          activeTaskCount: latest.activeTaskCount,
          recordedAt: latest.recordedAt.toISOString(),
        }
      : null,
  };
}

function serializeTask(task: any): SerializedTask {
  return {
    id: task.id,
    clusterId: task.clusterId,
    submittedByUserId: task.submittedByUserId,
    assignedNodeId: task.assignedNodeId,
    type: task.type,
    status: task.status,
    priority: task.priority,
    name: task.name,
    description: task.description,
    progressPercent: task.progressPercent,
    estimatedSeconds: task.estimatedSeconds,
    startedAt: task.startedAt?.toISOString() ?? null,
    completedAt: task.completedAt?.toISOString() ?? null,
    createdAt: task.createdAt.toISOString(),
  };
}

// ─── Cluster CRUD ─────────────────────────────────────────────────────────────

// POST /api/clusters — Create cluster
router.post(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const body = createClusterInput.parse(req.body);
    const cluster = await prisma.cluster.create({
      data: {
        name: body.name,
        description: body.description,
        ownerId: req.user!.userId,
        maxNodes: body.maxNodes ?? 5,
        inviteCode: crypto.randomUUID(),
      },
    });
    res.status(201).json({ cluster: serializeCluster(cluster) });
  })
);

// GET /api/clusters — List clusters for user
router.get(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const clusters = await prisma.cluster.findMany({
      where: {
        OR: [
          { ownerId: req.user!.userId },
          { nodes: { some: { userId: req.user!.userId } } },
        ],
      },
      include: {
        nodes: { select: { id: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ clusters: clusters.map((c) => serializeCluster(c, c.nodes)) });
  })
);

// GET /api/clusters/:clusterId — Get cluster details
router.get(
  "/:clusterId",
  asyncHandler(async (req: AuthedRequest, res) => {
    const { clusterId } = req.params;
    const cluster = await prisma.cluster.findFirst({
      where: {
        id: clusterId,
        OR: [
          { ownerId: req.user!.userId },
          { nodes: { some: { userId: req.user!.userId } } },
        ],
      },
      include: {
        nodes: {
          include: {
            telemetry: { orderBy: { recordedAt: "desc" }, take: 1 },
          },
        },
      },
    });
    if (!cluster) return res.status(404).json({ error: "Cluster not found" });
    res.json({
      cluster: serializeCluster(cluster, cluster.nodes),
      nodes: cluster.nodes.map(serializeNode),
    });
  })
);

// PATCH /api/clusters/:clusterId — Update cluster
router.patch(
  "/:clusterId",
  asyncHandler(async (req: AuthedRequest, res) => {
    const { clusterId } = req.params;
    const body = updateClusterInput.parse(req.body);
    const existing = await prisma.cluster.findFirst({
      where: { id: clusterId, ownerId: req.user!.userId },
    });
    if (!existing) return res.status(404).json({ error: "Cluster not found or not owner" });
    const updated = await prisma.cluster.update({
      where: { id: clusterId },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.maxNodes && { maxNodes: body.maxNodes }),
        ...(body.status && { status: body.status }),
      },
    });
    res.json({ cluster: serializeCluster(updated) });
  })
);

// DELETE /api/clusters/:clusterId — Delete cluster
router.delete(
  "/:clusterId",
  asyncHandler(async (req: AuthedRequest, res) => {
    const { clusterId } = req.params;
    const existing = await prisma.cluster.findFirst({
      where: { id: clusterId, ownerId: req.user!.userId },
    });
    if (!existing) return res.status(404).json({ error: "Cluster not found or not owner" });
    await prisma.cluster.delete({ where: { id: clusterId } });
    res.status(204).send();
  })
);

// ─── Join / Leave ─────────────────────────────────────────────────────────────

// POST /api/clusters/join — Join via invite code
router.post(
  "/join",
  asyncHandler(async (req: AuthedRequest, res) => {
    const body = joinClusterInput.parse(req.body);
    const cluster = await prisma.cluster.findUnique({
      where: { inviteCode: body.inviteCode },
      include: { nodes: true },
    });
    if (!cluster) return res.status(404).json({ error: "Invalid invite code" });
    if (cluster.status !== "active") return res.status(400).json({ error: "Cluster is not active" });
    if (cluster.nodes.length >= cluster.maxNodes) return res.status(400).json({ error: "Cluster is full" });

    // Verify device belongs to user
    const device = await prisma.device.findFirst({
      where: { id: body.deviceId, userId: req.user!.userId },
    });
    if (!device) return res.status(404).json({ error: "Device not found" });

    // Check not already in cluster
    const existing = await prisma.clusterNode.findUnique({
      where: { clusterId_deviceId: { clusterId: cluster.id, deviceId: body.deviceId } },
    });
    if (existing) return res.status(409).json({ error: "Device already in cluster" });

    const node = await prisma.clusterNode.create({
      data: {
        clusterId: cluster.id,
        deviceId: body.deviceId,
        userId: req.user!.userId,
        nickname: body.nickname,
      },
    });
    res.status(201).json({ node: serializeNode(node) });
  })
);

// DELETE /api/clusters/:clusterId/nodes/:nodeId — Leave or remove node
router.delete(
  "/:clusterId/nodes/:nodeId",
  asyncHandler(async (req: AuthedRequest, res) => {
    const { clusterId, nodeId } = req.params;
    const node = await prisma.clusterNode.findFirst({
      where: { id: nodeId, clusterId },
    });
    if (!node) return res.status(404).json({ error: "Node not found" });

    // Allow if user owns the node or owns the cluster
    const cluster = await prisma.cluster.findUnique({ where: { id: clusterId } });
    const isOwner = cluster?.ownerId === req.user!.userId;
    const isNodeUser = node.userId === req.user!.userId;
    if (!isOwner && !isNodeUser) return res.status(403).json({ error: "Forbidden" });

    await prisma.clusterNode.delete({ where: { id: nodeId } });
    res.status(204).send();
  })
);

// PATCH /api/clusters/:clusterId/nodes/:nodeId — Update node limits
router.patch(
  "/:clusterId/nodes/:nodeId",
  asyncHandler(async (req: AuthedRequest, res) => {
    const { clusterId, nodeId } = req.params;
    const body = updateNodeLimitsInput.parse(req.body);
    const node = await prisma.clusterNode.findFirst({
      where: { id: nodeId, clusterId, userId: req.user!.userId },
    });
    if (!node) return res.status(404).json({ error: "Node not found" });
    const updated = await prisma.clusterNode.update({
      where: { id: nodeId },
      data: {
        ...(body.cpuShareLimit !== undefined && { cpuShareLimit: body.cpuShareLimit }),
        ...(body.ramShareLimit !== undefined && { ramShareLimit: body.ramShareLimit }),
        ...(body.gpuShareLimit !== undefined && { gpuShareLimit: body.gpuShareLimit }),
        ...(body.priorityLevel !== undefined && { priorityLevel: body.priorityLevel }),
        ...(body.nickname !== undefined && { nickname: body.nickname }),
      },
    });
    res.json({ node: serializeNode(updated) });
  })
);

// ─── Telemetry ────────────────────────────────────────────────────────────────

// POST /api/clusters/:clusterId/telemetry — Submit heartbeat + telemetry
router.post(
  "/:clusterId/telemetry",
  asyncHandler(async (req: AuthedRequest, res) => {
    const { clusterId } = req.params;
    const body = telemetryInput.parse(req.body);

    // Verify node belongs to user and cluster
    const node = await prisma.clusterNode.findFirst({
      where: { id: body.nodeId, clusterId, userId: req.user!.userId },
    });
    if (!node) return res.status(404).json({ error: "Node not found" });

    const [telemetry] = await prisma.$transaction([
      prisma.nodeTelemetry.create({
        data: {
          nodeId: body.nodeId,
          cpuPercent: body.cpuPercent,
          ramPercent: body.ramPercent,
          ramUsedMb: body.ramUsedMb,
          ramTotalMb: body.ramTotalMb,
          gpuPercent: body.gpuPercent,
          gpuVramUsedMb: body.gpuVramUsedMb,
          gpuVramTotalMb: body.gpuVramTotalMb,
          gpuTempC: body.gpuTempC,
          cpuTempC: body.cpuTempC,
          networkUpKbps: body.networkUpKbps ?? 0,
          networkDownKbps: body.networkDownKbps ?? 0,
          activeTaskCount: body.activeTaskCount ?? 0,
        },
      }),
      prisma.clusterNode.update({
        where: { id: body.nodeId },
        data: {
          lastHeartbeatAt: new Date(),
          status: body.activeTaskCount && body.activeTaskCount > 0 ? "busy" : "online",
        },
      }),
    ]);

    // Attempt to schedule any pending tasks now that we have fresh telemetry
    void schedulePendingTasks(clusterId);

    res.status(201).json({ recorded: true, telemetryId: telemetry.id });
  })
);

// GET /api/clusters/:clusterId/telemetry — Latest telemetry for all nodes
router.get(
  "/:clusterId/telemetry",
  asyncHandler(async (req: AuthedRequest, res) => {
    const { clusterId } = req.params;
    const cluster = await prisma.cluster.findFirst({
      where: {
        id: clusterId,
        OR: [
          { ownerId: req.user!.userId },
          { nodes: { some: { userId: req.user!.userId } } },
        ],
      },
    });
    if (!cluster) return res.status(404).json({ error: "Cluster not found" });

    const nodes = await prisma.clusterNode.findMany({
      where: { clusterId },
      include: {
        telemetry: { orderBy: { recordedAt: "desc" }, take: 1 },
      },
    });
    res.json({ nodes: nodes.map(serializeNode) });
  })
);

// ─── Tasks ────────────────────────────────────────────────────────────────────

// POST /api/clusters/:clusterId/tasks — Submit a task
router.post(
  "/:clusterId/tasks",
  asyncHandler(async (req: AuthedRequest, res) => {
    const { clusterId } = req.params;
    const body = submitTaskInput.parse({ ...req.body, clusterId });

    const cluster = await prisma.cluster.findFirst({
      where: {
        id: clusterId,
        OR: [
          { ownerId: req.user!.userId },
          { nodes: { some: { userId: req.user!.userId } } },
        ],
      },
    });
    if (!cluster) return res.status(404).json({ error: "Cluster not found" });

    const task = await prisma.distributedTask.create({
      data: {
        clusterId,
        submittedByUserId: req.user!.userId,
        name: body.name,
        description: body.description,
        type: body.type,
        priority: body.priority ?? 5,
        payload: body.payload ?? {},
        estimatedSeconds: body.estimatedSeconds,
      },
    });

    // Try to schedule immediately
    void schedulePendingTasks(clusterId);

    res.status(201).json({ task: serializeTask(task) });
  })
);

// GET /api/clusters/:clusterId/tasks — List tasks
router.get(
  "/:clusterId/tasks",
  asyncHandler(async (req: AuthedRequest, res) => {
    const { clusterId } = req.params;
    const status = req.query.status as string | undefined;
    const limit = Math.min(parseInt(req.query.limit as string || "50", 10), 200);

    const cluster = await prisma.cluster.findFirst({
      where: {
        id: clusterId,
        OR: [
          { ownerId: req.user!.userId },
          { nodes: { some: { userId: req.user!.userId } } },
        ],
      },
    });
    if (!cluster) return res.status(404).json({ error: "Cluster not found" });

    const tasks = await prisma.distributedTask.findMany({
      where: {
        clusterId,
        ...(status && { status }),
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
    res.json({ tasks: tasks.map(serializeTask) });
  })
);

// PATCH /api/clusters/:clusterId/tasks/:taskId — Update task status (worker agent)
router.patch(
  "/:clusterId/tasks/:taskId",
  asyncHandler(async (req: AuthedRequest, res) => {
    const { clusterId, taskId } = req.params;
    const body = updateTaskStatusInput.parse(req.body);

    const task = await prisma.distributedTask.findFirst({
      where: { id: taskId, clusterId },
    });
    if (!task) return res.status(404).json({ error: "Task not found" });

    const isTerminal = body.status === "completed" || body.status === "failed" || body.status === "canceled";
    const updated = await prisma.distributedTask.update({
      where: { id: taskId },
      data: {
        status: body.status,
        ...(body.progressPercent !== undefined && { progressPercent: body.progressPercent }),
        ...(body.result && { result: body.result }),
        ...(body.errorMessage && { errorMessage: body.errorMessage }),
        ...(isTerminal && { completedAt: new Date() }),
      },
    });

    if (isTerminal) {
      void onTaskComplete(taskId);
    }

    res.json({ task: serializeTask(updated) });
  })
);

export default router;
