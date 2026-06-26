import { prisma } from "../../lib/prisma.js";

export const bandwidthService = {
  // Create bandwidth schedule
  async createSchedule(
    userId: string,
    options: {
      deviceId?: string;
      name: string;
      maxBandwidthMbps: number;
      priority?: number;
      startTime: string;
      endTime: string;
      daysOfWeek?: number[];
    }
  ) {
    return prisma.bandwidthSchedule.create({
      data: {
        userId,
        deviceId: options.deviceId,
        name: options.name,
        maxBandwidthMbps: options.maxBandwidthMbps,
        priority: options.priority || 5,
        startTime: options.startTime,
        endTime: options.endTime,
        daysOfWeek: options.daysOfWeek || [1, 2, 3, 4, 5, 6, 7],
      },
    });
  },

  // Get active bandwidth limit for current time
  async getActiveBandwidthLimit(userId: string, deviceId?: string): Promise<number | null> {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const currentDay = now.getDay() === 0 ? 7 : now.getDay(); // Convert Sunday from 0 to 7

    const where: any = { userId, isActive: true };
    if (deviceId) where.deviceId = deviceId;

    const schedules = await prisma.bandwidthSchedule.findMany({ where });

    // Find applicable schedules
    const applicable = schedules.filter((s) => {
      if (!s.daysOfWeek.includes(currentDay)) return false;
      return currentTime >= s.startTime && currentTime <= s.endTime;
    });

    if (applicable.length === 0) return null; // No limit

    // Return the most restrictive (lowest bandwidth) from highest priority
    const sorted = applicable.sort((a, b) => b.priority - a.priority);
    return sorted[0].maxBandwidthMbps;
  },

  // Get all schedules for a user
  async getSchedules(userId: string, deviceId?: string) {
    const where: any = { userId };
    if (deviceId) where.deviceId = deviceId;

    return prisma.bandwidthSchedule.findMany({
      where,
      orderBy: { priority: "desc" },
    });
  },

  // Update schedule
  async updateSchedule(scheduleId: string, updates: Partial<{
    name: string;
    maxBandwidthMbps: number;
    priority: number;
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
    isActive: boolean;
  }>) {
    return prisma.bandwidthSchedule.update({
      where: { id: scheduleId },
      data: updates,
    });
  },

  // Delete schedule
  async deleteSchedule(scheduleId: string) {
    return prisma.bandwidthSchedule.delete({
      where: { id: scheduleId },
    });
  },

  // ============================================================================
  // RELAY NODES
  // ============================================================================

  // Get available relay nodes
  async getRelayNodes(region?: string) {
    const where: any = { status: "active" };
    if (region) where.region = region;

    return prisma.relayNode.findMany({
      where,
      orderBy: { currentLoad: "asc" },
    });
  },

  // Find best relay for a connection
  async findBestRelay(userRegion: string, remoteRegion?: string): Promise<any | null> {
    // Get relays in user's region first
    let relays = await prisma.relayNode.findMany({
      where: { region: userRegion, status: "active" },
      orderBy: [{ avgLatency: "asc" }, { currentLoad: "asc" }],
    });

    // If no relays in region, find nearest
    if (relays.length === 0) {
      relays = await prisma.relayNode.findMany({
        where: { status: "active" },
        orderBy: [{ avgLatency: "asc" }, { currentLoad: "asc" }],
        take: 5,
      });
    }

    // Filter out overloaded relays
    const available = relays.filter((r) => r.currentLoad < r.capacity * 0.9);
    return available.length > 0 ? available[0] : null;
  },

  // Register a user-contributed relay node
  async registerContributedRelay(
    contributorId: string,
    data: {
      name: string;
      region: string;
      ipAddress: string;
      port: number;
      bandwidth: number;
    }
  ) {
    return prisma.relayNode.create({
      data: {
        name: data.name,
        region: data.region,
        ipAddress: data.ipAddress,
        port: data.port,
        capacity: 50, // Default capacity for contributed nodes
        bandwidth: data.bandwidth,
        isContributed: true,
        contributorId,
      },
    });
  },

  // Update relay load
  async updateRelayLoad(relayId: string, currentLoad: number) {
    return prisma.relayNode.update({
      where: { id: relayId },
      data: { currentLoad },
    });
  },

  // Get relay network stats
  async getRelayNetworkStats() {
    const relays = await prisma.relayNode.findMany();
    const active = relays.filter((r) => r.status === "active");
    const contributed = relays.filter((r) => r.isContributed);

    const totalCapacity = active.reduce((sum, r) => sum + r.capacity, 0);
    const totalLoad = active.reduce((sum, r) => sum + r.currentLoad, 0);
    const regions = [...new Set(active.map((r) => r.region))];

    return {
      totalNodes: relays.length,
      activeNodes: active.length,
      contributedNodes: contributed.length,
      totalCapacity,
      currentLoad: totalLoad,
      loadPercentage: totalCapacity > 0 ? (totalLoad / totalCapacity) * 100 : 0,
      regions: regions.length,
      regionList: regions,
    };
  },

  // ============================================================================
  // CONNECTION SESSIONS
  // ============================================================================

  // Start a connection session
  async startSession(
    userId: string,
    deviceId: string,
    remoteDeviceId: string,
    options: {
      protocol?: string;
      qualityProfile?: string;
      multiPathEnabled?: boolean;
      predictiveEnabled?: boolean;
    } = {}
  ) {
    return prisma.connectionSession.create({
      data: {
        userId,
        deviceId,
        remoteDeviceId,
        protocol: options.protocol || "custom_udp",
        qualityProfile: options.qualityProfile || "auto",
        multiPathEnabled: options.multiPathEnabled || false,
        predictiveEnabled: options.predictiveEnabled || false,
      },
    });
  },

  // Record connection metrics
  async recordMetrics(
    sessionId: string,
    metrics: {
      latency: number;
      jitter: number;
      packetLoss: number;
      bandwidth: number;
      usedBandwidth: number;
      fps: number;
      bitrate: number;
      resolution: string;
      encodeTime: number;
      decodeTime: number;
      frameDrops?: number;
      cpuUsage?: number;
      gpuUsage?: number;
    }
  ) {
    return prisma.connectionMetric.create({
      data: {
        sessionId,
        ...metrics,
        frameDrops: metrics.frameDrops || 0,
      },
    });
  },

  // End session
  async endSession(sessionId: string) {
    const session = await prisma.connectionSession.findUnique({
      where: { id: sessionId },
      include: { metrics: true },
    });

    if (!session) throw new Error("Session not found");

    const duration = Math.round((Date.now() - session.startedAt.getTime()) / 1000);
    const metrics = session.metrics;

    const avgLatency = metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.latency, 0) / metrics.length : null;
    const avgFps = metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.fps, 0) / metrics.length : null;
    const avgBitrate = metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.bitrate, 0) / metrics.length : null;
    const avgPacketLoss = metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.packetLoss, 0) / metrics.length : null;

    return prisma.connectionSession.update({
      where: { id: sessionId },
      data: {
        status: "ended",
        endedAt: new Date(),
        totalDuration: duration,
        avgLatency,
        avgFps,
        avgBitrate,
        packetLoss: avgPacketLoss,
      },
    });
  },

  // Get session history
  async getSessionHistory(userId: string, limit: number = 20) {
    return prisma.connectionSession.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: limit,
      include: {
        _count: { select: { metrics: true, qualityEvents: true } },
      },
    });
  },

  // Get session metrics
  async getSessionMetrics(sessionId: string, limit: number = 100) {
    return prisma.connectionMetric.findMany({
      where: { sessionId },
      orderBy: { timestamp: "desc" },
      take: limit,
    });
  },
};
