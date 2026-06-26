import { prisma } from "../lib/prisma.js";
import crypto from "crypto";

export const meshNetworkService = {
  // Generate WireGuard keypair
  generateKeypair() {
    const privateKey = crypto.randomBytes(32).toString("base64");
    const publicKey = crypto.randomBytes(32).toString("base64");
    return { privateKey, publicKey };
  },

  // Register mesh node
  async registerMeshNode(userId: string, deviceId: string, endpoint?: string) {
    const { publicKey } = this.generateKeypair();

    return prisma.meshNode.create({
      data: {
        userId,
        deviceId,
        publicKey,
        endpoint,
        isOnline: true,
      },
    });
  },

  // Get mesh nodes
  async getMeshNodes(userId: string) {
    return prisma.meshNode.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  // Update node status
  async updateNodeStatus(nodeId: string, isOnline: boolean) {
    return prisma.meshNode.update({
      where: { id: nodeId },
      data: {
        isOnline,
        lastHandshake: isOnline ? new Date() : undefined,
      },
    });
  },

  // Create mesh network
  async createMeshNetwork(userId: string, name: string, description?: string) {
    return prisma.meshNetwork.create({
      data: {
        userId,
        name,
        description,
      },
    });
  },

  // Get mesh networks
  async getMeshNetworks(userId: string) {
    return prisma.meshNetwork.findMany({
      where: { userId },
      include: {
        acls: true,
        dnsRecords: true,
      },
    });
  },

  // Add ACL rule
  async addACLRule(
    networkId: string,
    sourceNode: string,
    destNode: string,
    allowedPorts: number[] = [],
    schedule?: string
  ) {
    return prisma.meshACL.create({
      data: {
        networkId,
        sourceNode,
        destNode,
        allowedPorts,
        schedule,
      },
    });
  },

  // Get ACL rules
  async getACLRules(networkId: string) {
    return prisma.meshACL.findMany({
      where: { networkId },
    });
  },

  // Add DNS record
  async addDNSRecord(networkId: string, hostname: string, targetNodeId: string) {
    return prisma.dNSRecord.create({
      data: {
        networkId,
        hostname,
        targetNodeId,
      },
    });
  },

  // Get DNS records
  async getDNSRecords(networkId: string) {
    return prisma.dNSRecord.findMany({
      where: { networkId },
    });
  },

  // Record network metrics
  async recordNetworkMetric(
    userId: string,
    nodeId: string,
    latencyMs: number,
    bandwidthMbps: number,
    packetLoss: number
  ) {
    return prisma.networkMetric.create({
      data: {
        userId,
        nodeId,
        latencyMs,
        bandwidthMbps,
        packetLoss,
      },
    });
  },

  // Get network metrics
  async getNetworkMetrics(userId: string, nodeId?: string, limit: number = 100) {
    const where: any = { userId };
    if (nodeId) where.nodeId = nodeId;

    return prisma.networkMetric.findMany({
      where,
      orderBy: { recordedAt: "desc" },
      take: limit,
    });
  },

  // Get network health
  async getNetworkHealth(userId: string) {
    const nodes = await this.getMeshNodes(userId);
    const metrics = await this.getNetworkMetrics(userId, undefined, 1000);

    const onlineNodes = nodes.filter((n) => n.isOnline).length;
    const totalNodes = nodes.length;

    // Calculate average metrics
    const avgLatency =
      metrics.reduce((sum, m) => sum + m.latencyMs, 0) / (metrics.length || 1);
    const avgBandwidth =
      metrics.reduce((sum, m) => sum + m.bandwidthMbps, 0) / (metrics.length || 1);
    const avgPacketLoss =
      metrics.reduce((sum, m) => sum + m.packetLoss, 0) / (metrics.length || 1);

    // Health score (0-100)
    let healthScore = 100;
    if (avgLatency > 100) healthScore -= 10;
    if (avgLatency > 200) healthScore -= 10;
    if (avgPacketLoss > 1) healthScore -= 20;
    if (avgPacketLoss > 5) healthScore -= 20;
    if (onlineNodes < totalNodes) {
      healthScore -= (totalNodes - onlineNodes) * 10;
    }

    return {
      healthScore: Math.max(0, healthScore),
      onlineNodes,
      totalNodes,
      averageLatency: avgLatency,
      averageBandwidth: avgBandwidth,
      averagePacketLoss: avgPacketLoss,
    };
  },

  // Get network topology
  async getNetworkTopology(userId: string) {
    const nodes = await this.getMeshNodes(userId);
    const networks = await this.getMeshNetworks(userId);
    const metrics = await this.getNetworkMetrics(userId);

    // Build topology
    const topology = {
      nodes: nodes.map((n) => ({
        id: n.id,
        deviceId: n.deviceId,
        isOnline: n.isOnline,
        endpoint: n.endpoint,
      })),
      networks: networks.map((n) => ({
        id: n.id,
        name: n.name,
        acls: n.acls.length,
        dnsRecords: n.dnsRecords.length,
      })),
      metrics: metrics.slice(0, 50),
    };

    return topology;
  },

  // Speed test between nodes
  async recordSpeedTest(userId: string, sourceNodeId: string, destNodeId: string, results: any) {
    return prisma.networkMetric.create({
      data: {
        userId,
        nodeId: sourceNodeId,
        latencyMs: results.latency,
        bandwidthMbps: results.bandwidth,
        packetLoss: results.packetLoss,
      },
    });
  },

  // Get bandwidth analytics
  async getBandwidthAnalytics(userId: string, days: number = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const metrics = await prisma.networkMetric.findMany({
      where: {
        userId,
        recordedAt: { gte: since },
      },
      orderBy: { recordedAt: "asc" },
    });

    // Group by hour
    const hourlyData: Record<string, any> = {};
    metrics.forEach((m) => {
      const hour = new Date(m.recordedAt);
      hour.setMinutes(0, 0, 0);
      const key = hour.toISOString();

      if (!hourlyData[key]) {
        hourlyData[key] = { latencies: [], bandwidths: [], packetLosses: [] };
      }
      hourlyData[key].latencies.push(m.latencyMs);
      hourlyData[key].bandwidths.push(m.bandwidthMbps);
      hourlyData[key].packetLosses.push(m.packetLoss);
    });

    // Calculate averages
    const trends = Object.entries(hourlyData).map(([hour, data]) => ({
      hour,
      avgLatency: data.latencies.reduce((a: number, b: number) => a + b, 0) / data.latencies.length,
      avgBandwidth: data.bandwidths.reduce((a: number, b: number) => a + b, 0) / data.bandwidths.length,
      avgPacketLoss: data.packetLosses.reduce((a: number, b: number) => a + b, 0) / data.packetLosses.length,
    }));

    return trends;
  },
};
