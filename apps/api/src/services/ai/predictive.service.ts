import { prisma } from "../../lib/prisma.js";
export const predictiveService = {
  async predictFailure(deviceId: string): Promise<{ riskLevel: string; predictedFailure?: string; timeToFailure?: number; recommendations: string[] }> {
    const metrics = await prisma.deviceMetric.findMany({ where: { deviceId }, orderBy: { recordedAt: "desc" }, take: 100 });
    if (metrics.length < 10) return { riskLevel: "unknown", recommendations: ["Insufficient data for prediction"] };
    // Analyze trends
    const cpuTrend = metrics.slice(0, 10).reduce((s, m) => s + m.cpu, 0) / 10;
    const diskTrend = metrics.slice(0, 10).reduce((s, m) => s + m.disk, 0) / 10;
    const recommendations: string[] = [];
    let riskLevel = "low";
    if (cpuTrend > 90) { riskLevel = "high"; recommendations.push("CPU consistently at high load - risk of thermal throttling"); }
    if (diskTrend > 90) { riskLevel = "critical"; recommendations.push("Disk nearly full - imminent failure risk"); }
    return { riskLevel, recommendations, predictedFailure: riskLevel === "critical" ? "disk_full" : undefined, timeToFailure: riskLevel === "critical" ? 24 : undefined };
  },
  async getMaintenanceSchedule(orgId: string): Promise<Array<{ deviceId: string; task: string; priority: string; suggestedDate: Date }>> {
    return [{ deviceId: "dev-1", task: "Disk cleanup", priority: "high", suggestedDate: new Date(Date.now() + 86400000) }];
  },
};
