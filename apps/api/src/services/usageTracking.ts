import { prisma } from "../lib/prisma.js";

export interface UsageMetrics {
  connectionMinutes: number;
  dataTransferMb: number;
  devicesConnected: number;
  apiCallsCount: number;
}

export class UsageTrackingService {
  /**
   * Track session duration
   */
  async trackSessionDuration(
    userId: string,
    organizationId: string | null,
    durationSeconds: number
  ): Promise<void> {
    const durationMinutes = Math.ceil(durationSeconds / 60);

    // Track for user
    await prisma.billingUsage.create({
      data: {
        userId,
        organizationId,
        metric: "connection_minutes",
        quantity: durationMinutes,
        periodStart: this.getPeriodStart(),
        periodEnd: this.getPeriodEnd(),
      },
    });
  }

  /**
   * Track data transfer
   */
  async trackDataTransfer(
    userId: string,
    organizationId: string | null,
    bytesTransferred: number
  ): Promise<void> {
    const megabytes = bytesTransferred / (1024 * 1024);

    await prisma.billingUsage.create({
      data: {
        userId,
        organizationId,
        metric: "data_transfer_mb",
        quantity: megabytes,
        periodStart: this.getPeriodStart(),
        periodEnd: this.getPeriodEnd(),
      },
    });
  }

  /**
   * Track API call
   */
  async trackApiCall(userId: string, organizationId: string | null): Promise<void> {
    await prisma.billingUsage.create({
      data: {
        userId,
        organizationId,
        metric: "api_calls",
        quantity: 1,
        periodStart: this.getPeriodStart(),
        periodEnd: this.getPeriodEnd(),
      },
    });
  }

  /**
   * Get usage for current billing period
   */
  async getCurrentUsage(userId: string): Promise<UsageMetrics> {
    const periodStart = this.getPeriodStart();
    const periodEnd = this.getPeriodEnd();

    const usage = await prisma.billingUsage.groupBy({
      by: ["metric"],
      where: {
        userId,
        periodStart: { gte: periodStart },
        periodEnd: { lte: periodEnd },
      },
      _sum: {
        quantity: true,
      },
    });

    const metrics: UsageMetrics = {
      connectionMinutes: 0,
      dataTransferMb: 0,
      devicesConnected: 0,
      apiCallsCount: 0,
    };

    for (const row of usage) {
      if (row.metric === "connection_minutes") {
        metrics.connectionMinutes = Math.round(row._sum.quantity || 0);
      } else if (row.metric === "data_transfer_mb") {
        metrics.dataTransferMb = Math.round(row._sum.quantity || 0);
      } else if (row.metric === "api_calls") {
        metrics.apiCallsCount = Math.round(row._sum.quantity || 0);
      }
    }

    return metrics;
  }

  /**
   * Get usage for organization
   */
  async getOrganizationUsage(organizationId: string): Promise<UsageMetrics> {
    const periodStart = this.getPeriodStart();
    const periodEnd = this.getPeriodEnd();

    const usage = await prisma.billingUsage.groupBy({
      by: ["metric"],
      where: {
        organizationId,
        periodStart: { gte: periodStart },
        periodEnd: { lte: periodEnd },
      },
      _sum: {
        quantity: true,
      },
    });

    const metrics: UsageMetrics = {
      connectionMinutes: 0,
      dataTransferMb: 0,
      devicesConnected: 0,
      apiCallsCount: 0,
    };

    for (const row of usage) {
      if (row.metric === "connection_minutes") {
        metrics.connectionMinutes = Math.round(row._sum.quantity || 0);
      } else if (row.metric === "data_transfer_mb") {
        metrics.dataTransferMb = Math.round(row._sum.quantity || 0);
      } else if (row.metric === "api_calls") {
        metrics.apiCallsCount = Math.round(row._sum.quantity || 0);
      }
    }

    return metrics;
  }

  /**
   * Get usage history
   */
  async getUsageHistory(userId: string, days: number = 30): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return prisma.billingUsage.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: "desc" },
      take: 1000,
    });
  }

  /**
   * Check if user exceeded limits
   */
  async checkLimits(userId: string, plan: string): Promise<{ exceeded: boolean; limits: any }> {
    const usage = await this.getCurrentUsage(userId);

    const limits: Record<string, any> = {
      FREE: {
        connectionMinutes: 30,
        dataTransferMb: 100,
        devicesConnected: 1,
        apiCalls: 100,
      },
      PRO: {
        connectionMinutes: 10000,
        dataTransferMb: 50000,
        devicesConnected: 5,
        apiCalls: 100000,
      },
      BUSINESS: {
        connectionMinutes: null,
        dataTransferMb: null,
        devicesConnected: null,
        apiCalls: null,
      },
      ENTERPRISE: {
        connectionMinutes: null,
        dataTransferMb: null,
        devicesConnected: null,
        apiCalls: null,
      },
    };

    const planLimits = limits[plan] || limits.FREE;

    let exceeded = false;

    if (
      planLimits.connectionMinutes &&
      usage.connectionMinutes > planLimits.connectionMinutes
    ) {
      exceeded = true;
    }

    if (planLimits.dataTransferMb && usage.dataTransferMb > planLimits.dataTransferMb) {
      exceeded = true;
    }

    return { exceeded, limits: planLimits };
  }

  /**
   * Get billing period start date
   */
  private getPeriodStart(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  /**
   * Get billing period end date
   */
  private getPeriodEnd(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  }
}

export const usageTrackingService = new UsageTrackingService();
