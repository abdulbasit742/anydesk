import { prisma } from "../../lib/prisma.js";

// Patterns that indicate suspicious changes
const SUSPICIOUS_PATTERNS = {
  paths: [
    /system32/i,
    /windows\\system/i,
    /\\run\\|\\runonce\\/i,
    /startup/i,
    /\\drivers\\/i,
    /\\etc\/(passwd|shadow|sudoers)/,
    /\.ssh\/authorized_keys/,
    /crontab/,
  ],
  changeTypes: [
    "startup_added",
    "firewall_changed",
    "registry_modified",
    "user_added",
  ],
};

export const changeDetectionService = {
  // Record a system change
  async recordChange(
    snapshotId: string,
    userId: string,
    deviceId: string,
    change: {
      changeType: string;
      category: string;
      path?: string;
      oldValue?: string;
      newValue?: string;
      description: string;
    }
  ) {
    // Determine severity
    const severity = this.calculateSeverity(change);
    const isSuspicious = this.isSuspiciousChange(change);

    // AI analysis placeholder
    let aiAnalysis: string | null = null;
    if (isSuspicious) {
      aiAnalysis = this.generateAIAnalysis(change);
    }

    const systemChange = await prisma.systemChange.create({
      data: {
        snapshotId,
        userId,
        deviceId,
        changeType: change.changeType,
        category: change.category,
        severity,
        path: change.path,
        oldValue: change.oldValue,
        newValue: change.newValue,
        description: change.description,
        isSuspicious,
        aiAnalysis,
      },
    });

    return systemChange;
  },

  // Record multiple changes at once (batch)
  async recordChanges(
    snapshotId: string,
    userId: string,
    deviceId: string,
    changes: Array<{
      changeType: string;
      category: string;
      path?: string;
      oldValue?: string;
      newValue?: string;
      description: string;
    }>
  ) {
    const results = [];
    for (const change of changes) {
      const result = await this.recordChange(snapshotId, userId, deviceId, change);
      results.push(result);
    }
    return results;
  },

  // Get changes for a device
  async getChanges(
    userId: string,
    deviceId: string,
    options: {
      limit?: number;
      offset?: number;
      severity?: string;
      category?: string;
      suspiciousOnly?: boolean;
      since?: Date;
    } = {}
  ) {
    const { limit = 100, offset = 0, severity, category, suspiciousOnly, since } = options;

    const where: any = { userId, deviceId };
    if (severity) where.severity = severity;
    if (category) where.category = category;
    if (suspiciousOnly) where.isSuspicious = true;
    if (since) where.detectedAt = { gte: since };

    const [changes, total] = await Promise.all([
      prisma.systemChange.findMany({
        where,
        orderBy: { detectedAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.systemChange.count({ where }),
    ]);

    return { changes, total };
  },

  // Get change timeline (grouped by time)
  async getChangeTimeline(userId: string, deviceId: string, days: number = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const changes = await prisma.systemChange.findMany({
      where: {
        userId,
        deviceId,
        detectedAt: { gte: since },
      },
      orderBy: { detectedAt: "asc" },
    });

    // Group by day
    const timeline: Record<string, any> = {};
    for (const change of changes) {
      const day = change.detectedAt.toISOString().split("T")[0];
      if (!timeline[day]) {
        timeline[day] = {
          date: day,
          changes: [],
          totalCount: 0,
          criticalCount: 0,
          warningCount: 0,
          suspiciousCount: 0,
        };
      }
      timeline[day].changes.push(change);
      timeline[day].totalCount++;
      if (change.severity === "critical") timeline[day].criticalCount++;
      if (change.severity === "warning") timeline[day].warningCount++;
      if (change.isSuspicious) timeline[day].suspiciousCount++;
    }

    return Object.values(timeline);
  },

  // Get alerts (suspicious and critical changes)
  async getAlerts(userId: string, deviceId?: string, limit: number = 50) {
    const where: any = {
      userId,
      OR: [{ isSuspicious: true }, { severity: "critical" }],
    };
    if (deviceId) where.deviceId = deviceId;

    return prisma.systemChange.findMany({
      where,
      orderBy: { detectedAt: "desc" },
      take: limit,
    });
  },

  // Calculate severity of a change
  calculateSeverity(change: { changeType: string; category: string; path?: string }): string {
    // Critical changes
    if (
      change.changeType === "firewall_changed" ||
      change.changeType === "user_added" ||
      (change.path && /system32|\\drivers\\|\/etc\/(passwd|shadow)/i.test(change.path))
    ) {
      return "critical";
    }

    // Warning changes
    if (
      change.changeType === "startup_added" ||
      change.changeType === "registry_modified" ||
      change.changeType === "service_added" ||
      change.category === "security"
    ) {
      return "warning";
    }

    return "info";
  },

  // Check if a change is suspicious
  isSuspiciousChange(change: { changeType: string; path?: string }): boolean {
    // Check change type
    if (SUSPICIOUS_PATTERNS.changeTypes.includes(change.changeType)) {
      return true;
    }

    // Check path patterns
    if (change.path) {
      for (const pattern of SUSPICIOUS_PATTERNS.paths) {
        if (pattern.test(change.path)) {
          return true;
        }
      }
    }

    return false;
  },

  // Generate AI analysis for suspicious changes
  generateAIAnalysis(change: { changeType: string; path?: string; description: string }): string {
    const analyses: Record<string, string> = {
      startup_added:
        "New startup item detected. This could indicate legitimate software installation or potential malware persistence mechanism. Review the executable path and publisher.",
      firewall_changed:
        "Firewall rules were modified. Verify this was an authorized change. Unauthorized firewall modifications may indicate an attacker opening backdoor ports.",
      registry_modified:
        "Registry modification detected in a sensitive area. This could affect system behavior or security. Check if this correlates with recent software installations.",
      user_added:
        "New user account created. Verify this was authorized. Unauthorized user creation is a common post-exploitation technique.",
    };

    return analyses[change.changeType] || "Change detected in a monitored area. Review for unauthorized modifications.";
  },

  // Get change statistics
  async getChangeStats(userId: string, deviceId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    const [todayChanges, weekChanges, totalSuspicious, totalCritical] = await Promise.all([
      prisma.systemChange.count({
        where: { userId, deviceId, detectedAt: { gte: today } },
      }),
      prisma.systemChange.count({
        where: { userId, deviceId, detectedAt: { gte: thisWeek } },
      }),
      prisma.systemChange.count({
        where: { userId, deviceId, isSuspicious: true },
      }),
      prisma.systemChange.count({
        where: { userId, deviceId, severity: "critical" },
      }),
    ]);

    return {
      todayChanges,
      weekChanges,
      totalSuspicious,
      totalCritical,
    };
  },
};
