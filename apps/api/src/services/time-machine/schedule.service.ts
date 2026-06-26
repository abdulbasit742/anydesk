import { prisma } from "../../lib/prisma.js";

export const scheduleService = {
  // Create snapshot schedule
  async createSchedule(
    userId: string,
    deviceId: string,
    options: {
      name: string;
      cronExpression: string;
      snapshotType?: string;
      components?: string[];
      retentionDays?: number;
      maxSnapshots?: number;
    }
  ) {
    const nextRunAt = this.getNextRunTime(options.cronExpression);

    return prisma.snapshotSchedule.create({
      data: {
        userId,
        deviceId,
        name: options.name,
        cronExpression: options.cronExpression,
        snapshotType: options.snapshotType || "automatic",
        components: options.components || [],
        retentionDays: options.retentionDays || 30,
        maxSnapshots: options.maxSnapshots || 100,
        nextRunAt,
      },
    });
  },

  // Get schedules
  async getSchedules(userId: string, deviceId?: string) {
    const where: any = { userId };
    if (deviceId) where.deviceId = deviceId;

    return prisma.snapshotSchedule.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  },

  // Update schedule
  async updateSchedule(
    scheduleId: string,
    updates: {
      name?: string;
      cronExpression?: string;
      components?: string[];
      retentionDays?: number;
      maxSnapshots?: number;
      isActive?: boolean;
    }
  ) {
    const data: any = { ...updates };
    if (updates.cronExpression) {
      data.nextRunAt = this.getNextRunTime(updates.cronExpression);
    }

    return prisma.snapshotSchedule.update({
      where: { id: scheduleId },
      data,
    });
  },

  // Delete schedule
  async deleteSchedule(scheduleId: string) {
    return prisma.snapshotSchedule.delete({
      where: { id: scheduleId },
    });
  },

  // Get due schedules (for cron job)
  async getDueSchedules() {
    return prisma.snapshotSchedule.findMany({
      where: {
        isActive: true,
        nextRunAt: { lte: new Date() },
      },
    });
  },

  // Mark schedule as run
  async markScheduleRun(scheduleId: string, cronExpression: string) {
    const nextRunAt = this.getNextRunTime(cronExpression);

    return prisma.snapshotSchedule.update({
      where: { id: scheduleId },
      data: {
        lastRunAt: new Date(),
        nextRunAt,
      },
    });
  },

  // Generate compliance report
  async generateComplianceReport(
    userId: string,
    deviceId: string,
    snapshotId: string,
    reportType: string = "weekly"
  ) {
    const snapshot = await prisma.systemSnapshot.findUnique({
      where: { id: snapshotId },
      include: { components: true, changes: true },
    });

    if (!snapshot) throw new Error("Snapshot not found");

    // Generate findings
    const findings = {
      systemState: {
        snapshotVerified: !!snapshot.hashChain,
        encryptionEnabled: snapshot.isEncrypted,
        componentsIntact: snapshot.components.every((c) => c.checksum),
      },
      changes: {
        totalChanges: snapshot.changes.length,
        criticalChanges: snapshot.changes.filter((c) => c.severity === "critical").length,
        suspiciousChanges: snapshot.changes.filter((c) => c.isSuspicious).length,
      },
      compliance: {
        dataRetention: snapshot.retentionDays >= 30,
        hashChainIntegrity: !!snapshot.hashChain && !!snapshot.previousHash,
        encryptionAtRest: snapshot.isEncrypted,
      },
    };

    // Calculate score
    let score = 100;
    if (!findings.systemState.snapshotVerified) score -= 20;
    if (!findings.systemState.encryptionEnabled) score -= 15;
    if (findings.changes.criticalChanges > 0) score -= findings.changes.criticalChanges * 5;
    if (findings.changes.suspiciousChanges > 0) score -= findings.changes.suspiciousChanges * 3;
    if (!findings.compliance.hashChainIntegrity) score -= 10;
    score = Math.max(0, score);

    const report = await prisma.complianceReport.create({
      data: {
        userId,
        deviceId,
        snapshotId,
        reportType,
        title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Compliance Report - ${new Date().toISOString().split("T")[0]}`,
        findings,
        score,
      },
    });

    return report;
  },

  // Get compliance reports
  async getComplianceReports(userId: string, deviceId?: string, limit: number = 20) {
    const where: any = { userId };
    if (deviceId) where.deviceId = deviceId;

    return prisma.complianceReport.findMany({
      where,
      orderBy: { generatedAt: "desc" },
      take: limit,
    });
  },

  // Helper: Calculate next run time from cron expression (simplified)
  getNextRunTime(cronExpression: string): Date {
    const now = new Date();
    const parts = cronExpression.split(" ");

    // Simple cron parsing for common patterns
    if (cronExpression === "0 * * * *") {
      // Hourly
      const next = new Date(now);
      next.setHours(next.getHours() + 1, 0, 0, 0);
      return next;
    } else if (cronExpression === "0 0 * * *") {
      // Daily
      const next = new Date(now);
      next.setDate(next.getDate() + 1);
      next.setHours(0, 0, 0, 0);
      return next;
    } else if (cronExpression === "0 9 * * 1") {
      // Weekly Monday 9am
      const next = new Date(now);
      const daysUntilMonday = (8 - next.getDay()) % 7 || 7;
      next.setDate(next.getDate() + daysUntilMonday);
      next.setHours(9, 0, 0, 0);
      return next;
    }

    // Default: 1 hour from now
    const next = new Date(now);
    next.setHours(next.getHours() + 1);
    return next;
  },
};
