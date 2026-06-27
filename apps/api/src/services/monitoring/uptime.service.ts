import { prisma } from "../../lib/prisma.js";
export const uptimeService = {
  async recordHeartbeat(deviceId: string) {
    return prisma.heartbeat.create({ data: { deviceId, timestamp: new Date() } });
  },
  async calculateUptime(deviceId: string, days: number = 30): Promise<{ uptimePercentage: number; totalDowntime: number; incidents: number }> {
    const since = new Date(Date.now() - days * 86400000);
    const heartbeats = await prisma.heartbeat.findMany({ where: { deviceId, timestamp: { gte: since } }, orderBy: { timestamp: "asc" } });
    let downtime = 0; let incidents = 0;
    for (let i = 1; i < heartbeats.length; i++) {
      const gap = heartbeats[i].timestamp.getTime() - heartbeats[i - 1].timestamp.getTime();
      if (gap > 120000) { downtime += gap; incidents++; } // >2min gap = downtime
    }
    const totalTime = days * 86400000;
    return { uptimePercentage: ((totalTime - downtime) / totalTime) * 100, totalDowntime: downtime / 1000, incidents };
  },
  async getUptimeHistory(deviceId: string, days: number = 30) {
    const since = new Date(Date.now() - days * 86400000);
    return prisma.uptimeRecord.findMany({ where: { deviceId, date: { gte: since } }, orderBy: { date: "asc" } });
  },
  async checkDeviceHealth(deviceId: string): Promise<{ healthy: boolean; lastSeen: Date | null; issues: string[] }> {
    const lastHeartbeat = await prisma.heartbeat.findFirst({ where: { deviceId }, orderBy: { timestamp: "desc" } });
    const issues: string[] = [];
    if (!lastHeartbeat) return { healthy: false, lastSeen: null, issues: ["Never connected"] };
    const timeSinceLastBeat = Date.now() - lastHeartbeat.timestamp.getTime();
    if (timeSinceLastBeat > 300000) issues.push("Device offline (>5 min since last heartbeat)");
    return { healthy: issues.length === 0, lastSeen: lastHeartbeat.timestamp, issues };
  },
};
