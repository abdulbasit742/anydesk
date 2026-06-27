import { prisma } from "../../lib/prisma.js";
export const metricsService = {
  async recordMetrics(deviceId: string, metrics: { cpu: number; ram: number; disk: number; network_in: number; network_out: number; temperature?: number; processes: number; uptime: number }) {
    return prisma.deviceMetric.create({ data: { deviceId, ...metrics, recordedAt: new Date() } });
  },
  async getLatestMetrics(deviceId: string) { return prisma.deviceMetric.findFirst({ where: { deviceId }, orderBy: { recordedAt: "desc" } }); },
  async getMetricsHistory(deviceId: string, hours: number = 24) {
    const since = new Date(Date.now() - hours * 3600000);
    return prisma.deviceMetric.findMany({ where: { deviceId, recordedAt: { gte: since } }, orderBy: { recordedAt: "asc" } });
  },
  async getAverageMetrics(deviceId: string, hours: number = 24) {
    const metrics = await this.getMetricsHistory(deviceId, hours);
    if (metrics.length === 0) return null;
    return { avgCpu: metrics.reduce((s, m) => s + m.cpu, 0) / metrics.length, avgRam: metrics.reduce((s, m) => s + m.ram, 0) / metrics.length, avgDisk: metrics.reduce((s, m) => s + m.disk, 0) / metrics.length };
  },
  async getFleetOverview(orgId: string) {
    const devices = await prisma.device.findMany({ where: { userId: orgId } });
    const online = devices.filter(d => d.status === "online").length;
    return { total: devices.length, online, offline: devices.length - online, healthScore: (online / devices.length) * 100 };
  },
};
