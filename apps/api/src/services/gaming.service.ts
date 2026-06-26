import { prisma } from "../lib/prisma.js";

export const gamingService = {
  // Start gaming session
  async startGamingSession(userId: string, deviceId: string, gameTitle: string) {
    return prisma.gamingSession.create({
      data: {
        userId,
        deviceId,
        gameTitle,
        startedAt: new Date(),
      },
    });
  },

  // End gaming session
  async endGamingSession(sessionId: string, metrics: any) {
    const session = await prisma.gamingSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new Error("Session not found");

    const duration = Math.floor(
      (new Date().getTime() - session.startedAt.getTime()) / 1000
    );

    return prisma.gamingSession.update({
      where: { id: sessionId },
      data: {
        endedAt: new Date(),
        duration,
        averageLatency: metrics.averageLatency,
        averageFps: metrics.averageFps,
        averageBitrate: metrics.averageBitrate,
        maxBitrate: metrics.maxBitrate,
        encodeTime: metrics.encodeTime,
      },
    });
  },

  // Record streaming quality metrics
  async recordQualityMetric(sessionId: string, userId: string, metrics: any) {
    return prisma.streamingQualityMetric.create({
      data: {
        sessionId,
        userId,
        latency: metrics.latency,
        fps: metrics.fps,
        bitrate: metrics.bitrate,
        packetLoss: metrics.packetLoss,
      },
    });
  },

  // Get gaming analytics
  async getGamingAnalytics(userId: string) {
    const sessions = await prisma.gamingSession.findMany({
      where: { userId, endedAt: { not: null } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const totalSessions = sessions.length;
    const totalPlayTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const avgLatency =
      sessions.reduce((sum, s) => sum + (s.averageLatency || 0), 0) /
      (totalSessions || 1);
    const avgFps =
      sessions.reduce((sum, s) => sum + (s.averageFps || 0), 0) /
      (totalSessions || 1);
    const avgBitrate =
      sessions.reduce((sum, s) => sum + (s.averageBitrate || 0), 0) /
      (totalSessions || 1);

    // Game frequency
    const gameFrequency: Record<string, number> = {};
    sessions.forEach((s) => {
      gameFrequency[s.gameTitle] = (gameFrequency[s.gameTitle] || 0) + 1;
    });

    return {
      totalSessions,
      totalPlayTime,
      averageLatency: avgLatency,
      averageFps: avgFps,
      averageBitrate: avgBitrate,
      gameFrequency,
      recentSessions: sessions.slice(0, 10),
    };
  },

  // Add game to library
  async addGameToLibrary(
    userId: string,
    deviceId: string,
    gameName: string,
    installPath: string
  ) {
    return prisma.gameLibrary.create({
      data: {
        userId,
        deviceId,
        gameName,
        installPath,
      },
    });
  },

  // Get game library
  async getGameLibrary(userId: string) {
    return prisma.gameLibrary.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  // Get quality metrics for session
  async getSessionMetrics(sessionId: string) {
    return prisma.streamingQualityMetric.findMany({
      where: { sessionId },
      orderBy: { recordedAt: "asc" },
    });
  },

  // Get quality trends
  async getQualityTrends(userId: string, days: number = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const metrics = await prisma.streamingQualityMetric.findMany({
      where: {
        userId,
        recordedAt: { gte: since },
      },
      orderBy: { recordedAt: "asc" },
    });

    // Group by hour
    const hourlyMetrics: Record<string, any[]> = {};
    metrics.forEach((m) => {
      const hour = new Date(m.recordedAt);
      hour.setMinutes(0, 0, 0);
      const key = hour.toISOString();

      if (!hourlyMetrics[key]) hourlyMetrics[key] = [];
      hourlyMetrics[key].push(m);
    });

    // Calculate averages per hour
    const trends = Object.entries(hourlyMetrics).map(([hour, hourMetrics]) => {
      const avgLatency =
        hourMetrics.reduce((sum, m) => sum + m.latency, 0) / hourMetrics.length;
      const avgFps =
        hourMetrics.reduce((sum, m) => sum + m.fps, 0) / hourMetrics.length;
      const avgBitrate =
        hourMetrics.reduce((sum, m) => sum + m.bitrate, 0) / hourMetrics.length;
      const avgPacketLoss =
        hourMetrics.reduce((sum, m) => sum + m.packetLoss, 0) / hourMetrics.length;

      return { hour, avgLatency, avgFps, avgBitrate, avgPacketLoss };
    });

    return trends;
  },
};
