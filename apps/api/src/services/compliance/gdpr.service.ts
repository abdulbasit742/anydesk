import { prisma } from "../../lib/prisma.js";
export const gdprService = {
  async exportUserData(userId: string): Promise<Record<string, any>> {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { devices: true, sessions: true, subscriptions: true } });
    if (!user) throw new Error("User not found");
    return { personalInfo: { email: user.email, name: user.name, createdAt: user.createdAt }, devices: user.devices, sessions: user.sessions?.map(s => ({ id: s.id, startedAt: s.createdAt })), subscription: user.subscriptions };
  },
  async deleteUserData(userId: string, retainBilling: boolean = true) {
    // GDPR right to erasure
    await prisma.deviceLog.deleteMany({ where: { device: { userId } } });
    await prisma.notification.deleteMany({ where: { userId } });
    if (!retainBilling) { await prisma.invoice.deleteMany({ where: { userId } }); }
    await prisma.device.deleteMany({ where: { userId } });
    await prisma.user.update({ where: { id: userId }, data: { email: `deleted_${userId}@removed.com`, name: "Deleted User", status: "deleted" } });
    return { success: true, retainedBilling: retainBilling };
  },
  async getDataProcessingConsent(userId: string) { return prisma.consent.findMany({ where: { userId } }); },
  async recordConsent(userId: string, purpose: string, granted: boolean) { return prisma.consent.create({ data: { userId, purpose, granted, recordedAt: new Date() } }); },
};
