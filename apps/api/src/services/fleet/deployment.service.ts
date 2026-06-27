import { prisma } from "../../lib/prisma.js";
export const deploymentService = {
  async createDeployment(orgId: string, data: { name: string; type: "script" | "update" | "config" | "package"; payload: string; targetDevices: string[]; schedule?: Date }) {
    return prisma.deployment.create({ data: { orgId, name: data.name, type: data.type, payload: data.payload, targetDevices: data.targetDevices, totalDevices: data.targetDevices.length, completedDevices: 0, failedDevices: 0, status: data.schedule ? "scheduled" : "pending", scheduledAt: data.schedule } });
  },
  async executeDeployment(deploymentId: string) {
    return prisma.deployment.update({ where: { id: deploymentId }, data: { status: "running", startedAt: new Date() } });
  },
  async reportDeviceResult(deploymentId: string, deviceId: string, success: boolean, output?: string) {
    await prisma.deploymentResult.create({ data: { deploymentId, deviceId, success, output, completedAt: new Date() } });
    const field = success ? "completedDevices" : "failedDevices";
    const deployment = await prisma.deployment.update({ where: { id: deploymentId }, data: { [field]: { increment: 1 } } });
    if (deployment.completedDevices + deployment.failedDevices >= deployment.totalDevices) {
      await prisma.deployment.update({ where: { id: deploymentId }, data: { status: "completed", completedAt: new Date() } });
    }
    return deployment;
  },
  async getDeployments(orgId: string) { return prisma.deployment.findMany({ where: { orgId }, orderBy: { createdAt: "desc" } }); },
  async cancelDeployment(deploymentId: string) { return prisma.deployment.update({ where: { id: deploymentId }, data: { status: "cancelled" } }); },
  async rollbackDeployment(deploymentId: string) { return prisma.deployment.update({ where: { id: deploymentId }, data: { status: "rolling_back" } }); },
};
