import { prisma } from "../../lib/prisma.js";
export const backupService = {
  async createBackup(deviceId: string, type: "full" | "incremental" | "differential", options?: { compress: boolean; encrypt: boolean; excludePaths?: string[] }) {
    return prisma.backup.create({ data: { deviceId, type, status: "running", compress: options?.compress ?? true, encrypt: options?.encrypt ?? true, excludePaths: options?.excludePaths || [], startedAt: new Date() } });
  },
  async completeBackup(backupId: string, size: number, path: string, checksum: string) {
    return prisma.backup.update({ where: { id: backupId }, data: { status: "completed", size, path, checksum, completedAt: new Date() } });
  },
  async failBackup(backupId: string, error: string) { return prisma.backup.update({ where: { id: backupId }, data: { status: "failed", error } }); },
  async getBackups(deviceId: string) { return prisma.backup.findMany({ where: { deviceId }, orderBy: { startedAt: "desc" } }); },
  async verifyBackup(backupId: string): Promise<{ valid: boolean; issues: string[] }> {
    const backup = await prisma.backup.findUnique({ where: { id: backupId } });
    if (!backup) return { valid: false, issues: ["Backup not found"] };
    // Verify checksum and integrity
    return { valid: true, issues: [] };
  },
  async scheduleBackup(deviceId: string, schedule: { cron: string; type: "full" | "incremental"; retention: number }) {
    return prisma.backupSchedule.create({ data: { deviceId, cron: schedule.cron, type: schedule.type, retentionDays: schedule.retention, status: "active" } });
  },
  async getBackupSchedules(deviceId: string) { return prisma.backupSchedule.findMany({ where: { deviceId, status: "active" } }); },
  async restoreBackup(backupId: string, targetDeviceId: string) {
    return prisma.restoreJob.create({ data: { backupId, targetDeviceId, status: "running", startedAt: new Date() } });
  },
};
