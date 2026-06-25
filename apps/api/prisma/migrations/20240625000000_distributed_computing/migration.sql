-- CreateEnum
CREATE TYPE "ClusterStatus" AS ENUM ('active', 'inactive', 'degraded');

-- CreateEnum
CREATE TYPE "NodeStatus" AS ENUM ('online', 'offline', 'busy', 'idle', 'draining');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'queued', 'running', 'completed', 'failed', 'canceled');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('video_render', 'ai_inference', 'compilation', 'game_stream', 'scientific_compute', 'custom');

-- CreateTable
CREATE TABLE "Cluster" (
    "id"          TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "description" TEXT,
    "ownerId"     TEXT NOT NULL,
    "status"      "ClusterStatus" NOT NULL DEFAULT 'active',
    "inviteCode"  TEXT NOT NULL,
    "maxNodes"    INTEGER NOT NULL DEFAULT 5,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Cluster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClusterNode" (
    "id"                  TEXT NOT NULL,
    "clusterId"           TEXT NOT NULL,
    "deviceId"            TEXT NOT NULL,
    "userId"              TEXT NOT NULL,
    "nickname"            TEXT,
    "status"              "NodeStatus" NOT NULL DEFAULT 'offline',
    "cpuShareLimit"       DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "ramShareLimit"       DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "gpuShareLimit"       DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "priorityLevel"       INTEGER NOT NULL DEFAULT 5,
    "lastHeartbeatAt"     TIMESTAMP(3),
    "joinedAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"           TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ClusterNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NodeTelemetry" (
    "id"              TEXT NOT NULL,
    "nodeId"          TEXT NOT NULL,
    "cpuPercent"      DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ramPercent"      DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ramUsedMb"       DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ramTotalMb"      DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gpuPercent"      DOUBLE PRECISION,
    "gpuVramUsedMb"   DOUBLE PRECISION,
    "gpuVramTotalMb"  DOUBLE PRECISION,
    "gpuTempC"        DOUBLE PRECISION,
    "cpuTempC"        DOUBLE PRECISION,
    "networkUpKbps"   DOUBLE PRECISION NOT NULL DEFAULT 0,
    "networkDownKbps" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "activeTaskCount" INTEGER NOT NULL DEFAULT 0,
    "recordedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NodeTelemetry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistributedTask" (
    "id"               TEXT NOT NULL,
    "clusterId"        TEXT NOT NULL,
    "submittedByUserId" TEXT NOT NULL,
    "assignedNodeId"   TEXT,
    "type"             "TaskType" NOT NULL DEFAULT 'custom',
    "status"           "TaskStatus" NOT NULL DEFAULT 'pending',
    "priority"         INTEGER NOT NULL DEFAULT 5,
    "name"             TEXT NOT NULL,
    "description"      TEXT,
    "payload"          JSONB,
    "result"           JSONB,
    "errorMessage"     TEXT,
    "progressPercent"  DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estimatedSeconds" INTEGER,
    "startedAt"        TIMESTAMP(3),
    "completedAt"      TIMESTAMP(3),
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DistributedTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cluster_inviteCode_key" ON "Cluster"("inviteCode");
CREATE INDEX "Cluster_ownerId_idx" ON "Cluster"("ownerId");
CREATE INDEX "ClusterNode_clusterId_idx" ON "ClusterNode"("clusterId");
CREATE INDEX "ClusterNode_deviceId_idx" ON "ClusterNode"("deviceId");
CREATE UNIQUE INDEX "ClusterNode_clusterId_deviceId_key" ON "ClusterNode"("clusterId", "deviceId");
CREATE INDEX "NodeTelemetry_nodeId_recordedAt_idx" ON "NodeTelemetry"("nodeId", "recordedAt");
CREATE INDEX "DistributedTask_clusterId_status_idx" ON "DistributedTask"("clusterId", "status");
CREATE INDEX "DistributedTask_assignedNodeId_idx" ON "DistributedTask"("assignedNodeId");

-- AddForeignKey
ALTER TABLE "Cluster" ADD CONSTRAINT "Cluster_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClusterNode" ADD CONSTRAINT "ClusterNode_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "Cluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClusterNode" ADD CONSTRAINT "ClusterNode_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClusterNode" ADD CONSTRAINT "ClusterNode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NodeTelemetry" ADD CONSTRAINT "NodeTelemetry_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "ClusterNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DistributedTask" ADD CONSTRAINT "DistributedTask_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "Cluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DistributedTask" ADD CONSTRAINT "DistributedTask_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DistributedTask" ADD CONSTRAINT "DistributedTask_assignedNodeId_fkey" FOREIGN KEY ("assignedNodeId") REFERENCES "ClusterNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
