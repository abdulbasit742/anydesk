import { prisma } from "../../lib/prisma.js";
export const connectionAnalyticsService = {
  async getTotalConnections(days: number = 30): Promise<number> {
    const since = new Date(Date.now() - days * 86400000);
    return prisma.remoteSession.count({ where: { startedAt: { gte: since } } });
  },
  async getAverageSessionDuration(days: number = 30): Promise<number> {
    const since = new Date(Date.now() - days * 86400000);
    const sessions = await prisma.remoteSession.findMany({ where: { startedAt: { gte: since }, duration: { not: null } }, select: { duration: true } });
    if (sessions.length === 0) return 0;
    return sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length;
  },
  async getPeakHours(days: number = 7): Promise<Array<{ hour: number; connections: number }>> {
    const since = new Date(Date.now() - days * 86400000);
    const sessions = await prisma.remoteSession.findMany({ where: { startedAt: { gte: since } }, select: { startedAt: true } });
    const hourCounts = new Array(24).fill(0);
    sessions.forEach(s => { hourCounts[s.startedAt.getHours()]++; });
    return hourCounts.map((count, hour) => ({ hour, connections: count }));
  },
  async getBandwidthUsage(days: number = 30): Promise<{ totalGB: number; avgMbps: number }> {
    const since = new Date(Date.now() - days * 86400000);
    const sessions = await prisma.remoteSession.findMany({ where: { startedAt: { gte: since } }, select: { dataTransferred: true, duration: true } });
    const totalBytes = sessions.reduce((sum, s) => sum + (s.dataTransferred || 0), 0);
    const totalSeconds = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    return { totalGB: totalBytes / (1024 * 1024 * 1024), avgMbps: totalSeconds > 0 ? (totalBytes * 8) / (totalSeconds * 1000000) : 0 };
  },
};
