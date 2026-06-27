import { prisma } from "../../lib/prisma.js";
export const trialService = {
  async startTrial(userId: string, plan: string = "pro", durationDays: number = 14) {
    const endsAt = new Date(Date.now() + durationDays * 86400000);
    return prisma.trial.create({ data: { userId, plan, startedAt: new Date(), endsAt, status: "active" } });
  },
  async checkTrialStatus(userId: string): Promise<{ active: boolean; daysRemaining: number; plan?: string }> {
    const trial = await prisma.trial.findFirst({ where: { userId, status: "active" } });
    if (!trial) return { active: false, daysRemaining: 0 };
    const daysRemaining = Math.max(0, Math.ceil((trial.endsAt.getTime() - Date.now()) / 86400000));
    if (daysRemaining === 0) { await prisma.trial.update({ where: { id: trial.id }, data: { status: "expired" } }); return { active: false, daysRemaining: 0 }; }
    return { active: true, daysRemaining, plan: trial.plan };
  },
  async convertTrial(userId: string, subscriptionId: string) {
    const trial = await prisma.trial.findFirst({ where: { userId, status: "active" } });
    if (trial) await prisma.trial.update({ where: { id: trial.id }, data: { status: "converted", convertedAt: new Date() } });
    return trial;
  },
  async getTrialConversionRate(days: number = 30): Promise<number> {
    const since = new Date(Date.now() - days * 86400000);
    const total = await prisma.trial.count({ where: { startedAt: { gte: since } } });
    const converted = await prisma.trial.count({ where: { startedAt: { gte: since }, status: "converted" } });
    return total > 0 ? (converted / total) * 100 : 0;
  },
};
