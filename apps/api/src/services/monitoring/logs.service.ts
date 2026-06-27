import { prisma } from "../../lib/prisma.js";
export const logsService = {
  async ingestLog(deviceId: string, log: { level: string; source: string; message: string; metadata?: Record<string, any> }) {
    return prisma.deviceLog.create({ data: { deviceId, level: log.level, source: log.source, message: log.message, metadata: log.metadata || {}, timestamp: new Date() } });
  },
  async searchLogs(query: { deviceId?: string; level?: string; source?: string; search?: string; startDate?: Date; endDate?: Date; limit?: number }) {
    const where: any = {};
    if (query.deviceId) where.deviceId = query.deviceId;
    if (query.level) where.level = query.level;
    if (query.source) where.source = query.source;
    if (query.search) where.message = { contains: query.search };
    if (query.startDate || query.endDate) { where.timestamp = {}; if (query.startDate) where.timestamp.gte = query.startDate; if (query.endDate) where.timestamp.lte = query.endDate; }
    return prisma.deviceLog.findMany({ where, orderBy: { timestamp: "desc" }, take: query.limit || 100 });
  },
  async getLogStats(deviceId: string, hours: number = 24) {
    const since = new Date(Date.now() - hours * 3600000);
    const logs = await prisma.deviceLog.findMany({ where: { deviceId, timestamp: { gte: since } } });
    return { total: logs.length, error: logs.filter(l => l.level === "error").length, warn: logs.filter(l => l.level === "warn").length, info: logs.filter(l => l.level === "info").length };
  },
  async purgeOldLogs(daysToKeep: number = 90) {
    const cutoff = new Date(Date.now() - daysToKeep * 86400000);
    return prisma.deviceLog.deleteMany({ where: { timestamp: { lt: cutoff } } });
  },
};
