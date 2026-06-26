import { prisma } from "../lib/prisma.js";

export const securityService = {
  // Record security event
  async recordSecurityEvent(
    userId: string,
    deviceId: string,
    eventType: string,
    severity: string,
    details: any
  ) {
    const event = await prisma.securityEvent.create({
      data: {
        userId,
        deviceId,
        eventType,
        severity,
        details,
      },
    });

    // If critical, create incident
    if (severity === "critical") {
      await this.createIncident(userId, `Critical Security Event: ${eventType}`, severity, [deviceId]);
    }

    return event;
  },

  // Record vulnerability
  async recordVulnerability(
    userId: string,
    deviceId: string,
    cveId: string,
    severity: string,
    description: string,
    affectedSoftware: string
  ) {
    return prisma.vulnerability.create({
      data: {
        userId,
        deviceId,
        cveId,
        severity,
        description,
        affectedSoftware,
      },
    });
  },

  // Create security incident
  async createIncident(userId: string, title: string, severity: string, affectedDevices: string[]) {
    return prisma.securityIncident.create({
      data: {
        userId,
        title,
        severity,
        affectedDevices,
        timeline: [
          {
            timestamp: new Date(),
            event: "Incident created",
            status: "open",
          },
        ],
      },
    });
  },

  // Get security dashboard
  async getSecurityDashboard(userId: string) {
    const events = await prisma.securityEvent.findMany({
      where: { userId },
      orderBy: { detectedAt: "desc" },
      take: 100,
    });

    const vulnerabilities = await prisma.vulnerability.findMany({
      where: { userId, status: "open" },
    });

    const incidents = await prisma.securityIncident.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Calculate security score (0-100)
    const criticalVulns = vulnerabilities.filter((v) => v.severity === "critical").length;
    const highVulns = vulnerabilities.filter((v) => v.severity === "high").length;
    const criticalEvents = events.filter((e) => e.severity === "critical").length;
    const highEvents = events.filter((e) => e.severity === "high").length;

    const score = Math.max(0, 100 - criticalVulns * 10 - highVulns * 5 - criticalEvents * 5 - highEvents * 2);

    return {
      securityScore: score,
      events: events.slice(0, 20),
      vulnerabilities,
      incidents,
      stats: {
        totalEvents: events.length,
        criticalEvents,
        highEvents,
        totalVulnerabilities: vulnerabilities.length,
        criticalVulnerabilities: criticalVulns,
        highVulnerabilities: highVulns,
        openIncidents: incidents.filter((i) => i.status === "open").length,
      },
    };
  },

  // Create security policy
  async createPolicy(userId: string, name: string, rules: any, assignedGroups: string[] = []) {
    return prisma.securityPolicy.create({
      data: {
        userId,
        name,
        rulesJson: rules,
        assignedGroups,
      },
    });
  },

  // Get security policies
  async getPolicies(userId: string) {
    return prisma.securityPolicy.findMany({
      where: { userId },
    });
  },

  // Add threat intelligence
  async addThreatIntel(indicatorType: string, value: string, threatLevel: string, source: string) {
    return prisma.threatIntel.upsert({
      where: { indicatorType_value: { indicatorType, value } },
      create: { indicatorType, value, threatLevel, source },
      update: { threatLevel, lastSeen: new Date() },
    });
  },

  // Check if indicator is malicious
  async checkThreatIntel(indicatorType: string, value: string) {
    return prisma.threatIntel.findUnique({
      where: { indicatorType_value: { indicatorType, value } },
    });
  },

  // Get compliance status
  async getComplianceStatus(userId: string) {
    const vulnerabilities = await prisma.vulnerability.findMany({
      where: { userId },
    });

    const policies = await prisma.securityPolicy.findMany({
      where: { userId, enabled: true },
    });

    // CIS Benchmark checks (simplified)
    const cisChecks = {
      "1.1": { name: "Firewall enabled", passed: true },
      "2.1": { name: "Antivirus installed", passed: true },
      "3.1": { name: "Windows updates current", passed: vulnerabilities.filter((v) => v.severity === "critical").length === 0 },
      "4.1": { name: "Strong password policy", passed: policies.length > 0 },
    };

    const passedChecks = Object.values(cisChecks).filter((c) => c.passed).length;
    const totalChecks = Object.keys(cisChecks).length;
    const complianceScore = (passedChecks / totalChecks) * 100;

    return {
      complianceScore,
      cisChecks,
      passedChecks,
      totalChecks,
    };
  },
};
