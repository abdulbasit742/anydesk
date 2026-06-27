import { prisma } from "../../lib/prisma.js";
export type AlertSeverity = "critical" | "warning" | "info";
export const alertsService = {
  async createAlert(deviceId: string, alert: { type: string; severity: AlertSeverity; message: string; threshold?: number; currentValue?: number }) {
    return prisma.alert.create({ data: { deviceId, type: alert.type, severity: alert.severity, message: alert.message, threshold: alert.threshold, currentValue: alert.currentValue, status: "active", triggeredAt: new Date() } });
  },
  async acknowledgeAlert(alertId: string, userId: string) { return prisma.alert.update({ where: { id: alertId }, data: { status: "acknowledged", acknowledgedBy: userId, acknowledgedAt: new Date() } }); },
  async resolveAlert(alertId: string) { return prisma.alert.update({ where: { id: alertId }, data: { status: "resolved", resolvedAt: new Date() } }); },
  async getActiveAlerts(deviceId?: string) {
    const where: any = { status: { in: ["active", "acknowledged"] } };
    if (deviceId) where.deviceId = deviceId;
    return prisma.alert.findMany({ where, orderBy: [{ severity: "asc" }, { triggeredAt: "desc" }] });
  },
  async createAlertRule(orgId: string, rule: { name: string; metric: string; condition: string; threshold: number; severity: AlertSeverity; targetDevices?: string[] }) {
    return prisma.alertRule.create({ data: { orgId, ...rule, status: "active" } });
  },
  async getAlertRules(orgId: string) { return prisma.alertRule.findMany({ where: { orgId, status: "active" } }); },
};
