import { prisma } from "../../lib/prisma.js";
export type ThreatLevel = "critical" | "high" | "medium" | "low" | "info";
export const threatDetectionService = {
  async reportThreat(deviceId: string, threat: { type: string; level: ThreatLevel; description: string; source: string; indicators: string[] }) {
    return prisma.securityEvent.create({ data: { deviceId, type: threat.type, level: threat.level, description: threat.description, source: threat.source, indicators: threat.indicators, status: "open", detectedAt: new Date() } });
  },
  async getActiveThreats(orgId?: string) {
    const where: any = { status: { in: ["open", "investigating"] } };
    return prisma.securityEvent.findMany({ where, orderBy: [{ level: "asc" }, { detectedAt: "desc" }] });
  },
  async acknowledgeThread(threatId: string, userId: string) { return prisma.securityEvent.update({ where: { id: threatId }, data: { status: "investigating", acknowledgedBy: userId, acknowledgedAt: new Date() } }); },
  async resolveThread(threatId: string, resolution: string) { return prisma.securityEvent.update({ where: { id: threatId }, data: { status: "resolved", resolution, resolvedAt: new Date() } }); },
  async getThreatStats(days: number = 30) {
    const since = new Date(Date.now() - days * 86400000);
    const events = await prisma.securityEvent.findMany({ where: { detectedAt: { gte: since } } });
    return { total: events.length, critical: events.filter(e => e.level === "critical").length, high: events.filter(e => e.level === "high").length, medium: events.filter(e => e.level === "medium").length, resolved: events.filter(e => e.status === "resolved").length };
  },
};
