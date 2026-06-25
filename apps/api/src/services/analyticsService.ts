import { prisma } from "../lib/prisma.js";

export interface AnalyticsMetrics {
  totalConnections: number;
  totalUsers: number;
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  churnRate: number;
  conversionRate: number;
  averageSessionDuration: number;
  peakHours: Array<{ hour: number; connections: number }>;
  topDevices: Array<{ deviceId: string; connectionCount: number }>;
  usersByPlan: Record<string, number>;
}

export class AnalyticsService {
  /**
   * Get overall analytics
   */
  async getAnalytics(days: number = 30): Promise<AnalyticsMetrics> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total connections
    const totalConnections = await prisma.session.count({
      where: {
        createdAt: { gte: startDate },
      },
    });

    // Total users
    const totalUsers = await prisma.user.count();

    // Total revenue (from invoices)
    const invoices = await prisma.invoice.findMany({
      where: {
        status: "paid",
        createdAt: { gte: startDate },
      },
    });

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);

    // Monthly recurring revenue
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        user: true,
      },
    });

    let mrrAmount = 0;
    for (const sub of activeSubscriptions) {
      if (sub.plan === "PRO") {
        mrrAmount += 999; // $9.99 in cents
      } else if (sub.plan === "BUSINESS") {
        mrrAmount += 2999; // $29.99 in cents
      }
    }
    const monthlyRecurringRevenue = mrrAmount;
    const annualRecurringRevenue = mrrAmount * 12;

    // Churn rate
    const canceledSubscriptions = await prisma.subscription.count({
      where: {
        status: "CANCELED",
        updatedAt: { gte: startDate },
      },
    });

    const churnRate = activeSubscriptions.length > 0
      ? (canceledSubscriptions / (activeSubscriptions.length + canceledSubscriptions)) * 100
      : 0;

    // Conversion rate (trial to paid)
    const trialSubscriptions = await prisma.subscription.count({
      where: { status: "TRIALING" },
    });

    const paidSubscriptions = await prisma.subscription.count({
      where: {
        status: "ACTIVE",
        plan: { not: "FREE" },
      },
    });

    const conversionRate = (trialSubscriptions + paidSubscriptions) > 0
      ? (paidSubscriptions / (trialSubscriptions + paidSubscriptions)) * 100
      : 0;

    // Average session duration
    const sessions = await prisma.session.findMany({
      where: {
        createdAt: { gte: startDate },
        endedAt: { not: null },
      },
      select: {
        startedAt: true,
        endedAt: true,
      },
    });

    let totalDuration = 0;
    for (const session of sessions) {
      if (session.endedAt) {
        totalDuration += session.endedAt.getTime() - session.startedAt.getTime();
      }
    }
    const averageSessionDuration = sessions.length > 0
      ? Math.round(totalDuration / sessions.length / 1000)
      : 0;

    // Peak hours
    const peakHours = await this.getPeakHours(startDate);

    // Top devices
    const topDevices = await this.getTopDevices(startDate);

    // Users by plan
    const usersByPlan = await this.getUsersByPlan();

    return {
      totalConnections,
      totalUsers,
      totalRevenue,
      monthlyRecurringRevenue,
      annualRecurringRevenue,
      churnRate: Math.round(churnRate * 100) / 100,
      conversionRate: Math.round(conversionRate * 100) / 100,
      averageSessionDuration,
      peakHours,
      topDevices,
      usersByPlan,
    };
  }

  /**
   * Get peak hours
   */
  private async getPeakHours(startDate: Date): Promise<Array<{ hour: number; connections: number }>> {
    const sessions = await prisma.session.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
      },
    });

    const hourCounts: Record<number, number> = {};

    for (const session of sessions) {
      const hour = session.createdAt.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }

    return Object.entries(hourCounts)
      .map(([hour, connections]) => ({
        hour: parseInt(hour),
        connections,
      }))
      .sort((a, b) => b.connections - a.connections)
      .slice(0, 5);
  }

  /**
   * Get top devices
   */
  private async getTopDevices(startDate: Date): Promise<Array<{ deviceId: string; connectionCount: number }>> {
    const sessions = await prisma.session.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        deviceId: true,
      },
    });

    const deviceCounts: Record<string, number> = {};

    for (const session of sessions) {
      deviceCounts[session.deviceId] = (deviceCounts[session.deviceId] || 0) + 1;
    }

    return Object.entries(deviceCounts)
      .map(([deviceId, connectionCount]) => ({
        deviceId,
        connectionCount,
      }))
      .sort((a, b) => b.connectionCount - a.connectionCount)
      .slice(0, 10);
  }

  /**
   * Get users by plan
   */
  private async getUsersByPlan(): Promise<Record<string, number>> {
    const users = await prisma.user.groupBy({
      by: ["plan"],
      _count: {
        id: true,
      },
    });

    const result: Record<string, number> = {
      FREE: 0,
      PRO: 0,
      BUSINESS: 0,
      ENTERPRISE: 0,
    };

    for (const user of users) {
      result[user.plan] = user._count.id;
    }

    return result;
  }

  /**
   * Get revenue metrics
   */
  async getRevenueMetrics(days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailyRevenue: Record<string, number> = {};

    const invoices = await prisma.invoice.findMany({
      where: {
        status: "paid",
        createdAt: { gte: startDate },
      },
    });

    for (const invoice of invoices) {
      const date = invoice.createdAt.toISOString().split("T")[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + invoice.amount;
    }

    return {
      dailyRevenue,
      totalRevenue: invoices.reduce((sum, inv) => sum + inv.amount, 0),
      averageDailyRevenue: invoices.length > 0
        ? Math.round(invoices.reduce((sum, inv) => sum + inv.amount, 0) / days)
        : 0,
    };
  }

  /**
   * Get user retention metrics
   */
  async getRetentionMetrics(): Promise<any> {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: { createdAt: true },
        },
      },
    });

    const active = subscriptions.filter((s) => s.status === "ACTIVE").length;
    const canceled = subscriptions.filter((s) => s.status === "CANCELED").length;
    const trialing = subscriptions.filter((s) => s.status === "TRIALING").length;

    return {
      active,
      canceled,
      trialing,
      retentionRate: active > 0 ? Math.round((active / (active + canceled)) * 100) : 0,
    };
  }
}

export const analyticsService = new AnalyticsService();
