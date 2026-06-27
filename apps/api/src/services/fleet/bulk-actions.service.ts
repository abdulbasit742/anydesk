import { prisma } from "../../lib/prisma.js";
export const bulkActionsService = {
  async executeAction(orgId: string, action: string, deviceIds: string[], params?: Record<string, any>) {
    const job = await prisma.bulkJob.create({ data: { orgId, action, deviceIds, params: params || {}, totalDevices: deviceIds.length, status: "running", startedAt: new Date() } });
    // Queue action for each device
    for (const deviceId of deviceIds) { await prisma.bulkJobResult.create({ data: { jobId: job.id, deviceId, status: "pending" } }); }
    return job;
  },
  async reportResult(jobId: string, deviceId: string, status: "success" | "failed", output?: string) {
    await prisma.bulkJobResult.update({ where: { jobId_deviceId: { jobId, deviceId } }, data: { status, output, completedAt: new Date() } });
    const results = await prisma.bulkJobResult.findMany({ where: { jobId } });
    const completed = results.filter(r => r.status !== "pending").length;
    if (completed >= results.length) { await prisma.bulkJob.update({ where: { id: jobId }, data: { status: "completed", completedAt: new Date() } }); }
  },
  async getJobStatus(jobId: string) { return prisma.bulkJob.findUnique({ where: { id: jobId }, include: { results: true } }); },
  async getJobs(orgId: string) { return prisma.bulkJob.findMany({ where: { orgId }, orderBy: { startedAt: "desc" } }); },
};
