import crypto from "crypto";
import { prisma } from "../../lib/prisma.js";
export const sessionService = {
  async createSession(userId: string, deviceInfo: { ip: string; userAgent: string; deviceId?: string }) {
    const token = crypto.randomBytes(64).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return prisma.session.create({ data: { userId, token, ip: deviceInfo.ip, userAgent: deviceInfo.userAgent, deviceId: deviceInfo.deviceId, expiresAt } });
  },
  async validateSession(token: string) {
    const session = await prisma.session.findUnique({ where: { token } });
    if (!session || session.expiresAt < new Date()) return null;
    await prisma.session.update({ where: { id: session.id }, data: { lastActiveAt: new Date() } });
    return session;
  },
  async revokeSession(sessionId: string) { return prisma.session.delete({ where: { id: sessionId } }); },
  async revokeAllSessions(userId: string, exceptSessionId?: string) {
    const where: any = { userId };
    if (exceptSessionId) where.id = { not: exceptSessionId };
    return prisma.session.deleteMany({ where });
  },
  async getActiveSessions(userId: string) { return prisma.session.findMany({ where: { userId, expiresAt: { gt: new Date() } }, orderBy: { lastActiveAt: "desc" } }); },
};
