import { prisma } from "../../lib/prisma.js";
export const auditService = {
  async log(userId: string, action: string, resource: string, details?: Record<string, any>) {
    return prisma.auditLog.create({ data: { userId, action, resource, details: details || {}, ip: details?.ip, userAgent: details?.userAgent, timestamp: new Date() } });
  },
  async getAuditLogs(filters: { userId?: string; action?: string; resource?: string; startDate?: Date; endDate?: Date; limit?: number }) {
    const where: any = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.resource) where.resource = filters.resource;
    if (filters.startDate || filters.endDate) { where.timestamp = {}; if (filters.startDate) where.timestamp.gte = filters.startDate; if (filters.endDate) where.timestamp.lte = filters.endDate; }
    return prisma.auditLog.findMany({ where, orderBy: { timestamp: "desc" }, take: filters.limit || 100 });
  },
  async generateAuditReport(orgId: string, startDate: Date, endDate: Date) {
    const logs = await this.getAuditLogs({ startDate, endDate, limit: 10000 });
    return { period: { start: startDate, end: endDate }, totalActions: logs.length, uniqueUsers: new Set(logs.map(l => l.userId)).size, actionBreakdown: logs.reduce((acc, l) => { acc[l.action] = (acc[l.action] || 0) + 1; return acc; }, {} as Record<string, number>) };
  },
  async exportAuditLogs(orgId: string, format: "csv" | "json", startDate: Date, endDate: Date): Promise<string> {
    const logs = await this.getAuditLogs({ startDate, endDate, limit: 50000 });
    if (format === "json") return JSON.stringify(logs, null, 2);
    const csv = ["timestamp,userId,action,resource,details", ...logs.map(l => `${l.timestamp},${l.userId},${l.action},${l.resource},"${JSON.stringify(l.details)}"`)].join("\n");
    return csv;
  },
};
