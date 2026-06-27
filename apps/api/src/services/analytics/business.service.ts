import { prisma } from "../../lib/prisma.js";
export const businessAnalyticsService = {
  async getMRR(): Promise<number> {
    const activeSubscriptions = await prisma.subscription.findMany({ where: { status: "active" } });
    return activeSubscriptions.reduce((sum, sub) => sum + (sub.monthlyAmount || 0), 0);
  },
  async getARR(): Promise<number> { return (await this.getMRR()) * 12; },
  async getChurnRate(days: number = 30): Promise<number> {
    const since = new Date(Date.now() - days * 86400000);
    const cancelled = await prisma.subscription.count({ where: { status: "cancelled", cancelledAt: { gte: since } } });
    const total = await prisma.subscription.count({ where: { createdAt: { lt: since } } });
    return total > 0 ? (cancelled / total) * 100 : 0;
  },
  async getRevenueByPlan(): Promise<Record<string, number>> {
    const subs = await prisma.subscription.findMany({ where: { status: "active" } });
    return subs.reduce((acc, sub) => { acc[sub.plan] = (acc[sub.plan] || 0) + (sub.monthlyAmount || 0); return acc; }, {} as Record<string, number>);
  },
  async getUserGrowth(days: number = 30): Promise<Array<{ date: string; count: number }>> {
    const since = new Date(Date.now() - days * 86400000);
    const users = await prisma.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } });
    const byDate: Record<string, number> = {};
    users.forEach(u => { const date = u.createdAt.toISOString().split("T")[0]; byDate[date] = (byDate[date] || 0) + 1; });
    return Object.entries(byDate).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));
  },
  async getDAU(): Promise<number> {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return prisma.session.count({ where: { lastActiveAt: { gte: today } } });
  },
  async getMAU(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const sessions = await prisma.session.findMany({ where: { lastActiveAt: { gte: thirtyDaysAgo } }, select: { userId: true }, distinct: ["userId"] });
    return sessions.length;
  },
};
