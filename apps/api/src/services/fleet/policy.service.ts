import { prisma } from "../../lib/prisma.js";
export type PolicyType = "security" | "update" | "access" | "monitoring" | "backup" | "network";
export const policyService = {
  async createPolicy(orgId: string, data: { name: string; type: PolicyType; rules: Record<string, any>; priority: number; targetGroups?: string[] }) {
    return prisma.policy.create({ data: { orgId, name: data.name, type: data.type, rules: data.rules, priority: data.priority, targetGroups: data.targetGroups || [], status: "active" } });
  },
  async applyPolicyToGroup(policyId: string, groupId: string) {
    const policy = await prisma.policy.findUnique({ where: { id: policyId } });
    if (!policy) throw new Error("Policy not found");
    const groups = [...(policy.targetGroups as string[]), groupId];
    return prisma.policy.update({ where: { id: policyId }, data: { targetGroups: groups } });
  },
  async getDevicePolicies(deviceId: string) {
    const groups = await prisma.deviceGroupMembership.findMany({ where: { deviceId }, select: { groupId: true } });
    const groupIds = groups.map(g => g.groupId);
    return prisma.policy.findMany({ where: { targetGroups: { hasSome: groupIds }, status: "active" }, orderBy: { priority: "desc" } });
  },
  async evaluateCompliance(deviceId: string): Promise<{ compliant: boolean; violations: string[] }> {
    const policies = await this.getDevicePolicies(deviceId);
    const violations: string[] = [];
    // Check each policy rule against device state
    for (const policy of policies) { /* compliance check logic */ }
    return { compliant: violations.length === 0, violations };
  },
  async getPolicies(orgId: string) { return prisma.policy.findMany({ where: { orgId }, orderBy: { priority: "desc" } }); },
};
