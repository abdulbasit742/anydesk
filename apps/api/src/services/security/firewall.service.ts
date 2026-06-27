import { prisma } from "../../lib/prisma.js";
export const firewallService = {
  async createRule(deviceId: string, rule: { direction: "inbound" | "outbound"; action: "allow" | "deny"; protocol: string; port?: number; sourceIp?: string; destIp?: string; priority: number }) {
    return prisma.firewallRule.create({ data: { deviceId, ...rule, status: "active" } });
  },
  async getRules(deviceId: string) { return prisma.firewallRule.findMany({ where: { deviceId, status: "active" }, orderBy: { priority: "asc" } }); },
  async deleteRule(ruleId: string) { return prisma.firewallRule.update({ where: { id: ruleId }, data: { status: "deleted" } }); },
  async blockIP(deviceId: string, ip: string, reason: string, duration?: number) {
    const expiresAt = duration ? new Date(Date.now() + duration * 1000) : null;
    return prisma.firewallRule.create({ data: { deviceId, direction: "inbound", action: "deny", protocol: "all", sourceIp: ip, priority: 1, status: "active", reason, expiresAt } });
  },
  async getBlockedIPs(deviceId: string) { return prisma.firewallRule.findMany({ where: { deviceId, action: "deny", status: "active" } }); },
};
