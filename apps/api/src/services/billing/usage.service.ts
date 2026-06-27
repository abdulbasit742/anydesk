import { prisma } from "../../lib/prisma.js";
export type UsageType = "connection_minutes" | "data_transfer_gb" | "devices_connected" | "api_calls" | "file_transfers" | "recordings";
export const usageService = {
  async recordUsage(userId: string, type: UsageType, quantity: number, metadata?: Record<string, any>) {
    return prisma.usageRecord.create({ data: { userId, type, quantity, metadata: metadata || {}, recordedAt: new Date() } });
  },
  async getUsageSummary(userId: string, startDate: Date, endDate: Date) {
    const records = await prisma.usageRecord.findMany({ where: { userId, recordedAt: { gte: startDate, lte: endDate } } });
    const summary: Record<string, number> = {};
    for (const record of records) { summary[record.type] = (summary[record.type] || 0) + record.quantity; }
    return summary;
  },
  async getCurrentMonthUsage(userId: string) {
    const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0);
    return this.getUsageSummary(userId, startOfMonth, new Date());
  },
  async checkUsageLimit(userId: string, type: UsageType, limit: number): Promise<{ allowed: boolean; current: number; limit: number; remaining: number }> {
    const usage = await this.getCurrentMonthUsage(userId);
    const current = usage[type] || 0;
    return { allowed: current < limit, current, limit, remaining: Math.max(0, limit - current) };
  },
  async getUsageHistory(userId: string, type: UsageType, days: number = 30) {
    const since = new Date(Date.now() - days * 86400000);
    return prisma.usageRecord.findMany({ where: { userId, type, recordedAt: { gte: since } }, orderBy: { recordedAt: "asc" } });
  },
};
