import { prisma } from "../../lib/prisma.js";
export const remoteControlService = {
  async initiateConnection(fromDeviceId: string, toDeviceId: string, userId: string) {
    const session = await prisma.remoteSession.create({ data: { fromDeviceId, toDeviceId, userId, status: "connecting", protocol: "custom_udp", startedAt: new Date() } });
    return { sessionId: session.id, signalingToken: `sig_${session.id}_${Date.now()}` };
  },
  async acceptConnection(sessionId: string) { return prisma.remoteSession.update({ where: { id: sessionId }, data: { status: "connected", connectedAt: new Date() } }); },
  async rejectConnection(sessionId: string, reason?: string) { return prisma.remoteSession.update({ where: { id: sessionId }, data: { status: "rejected", endedAt: new Date() } }); },
  async endConnection(sessionId: string) {
    const session = await prisma.remoteSession.findUnique({ where: { id: sessionId } });
    if (!session) throw new Error("Session not found");
    const duration = Math.round((Date.now() - session.startedAt.getTime()) / 1000);
    return prisma.remoteSession.update({ where: { id: sessionId }, data: { status: "ended", endedAt: new Date(), duration } });
  },
  async getActiveConnections(userId: string) { return prisma.remoteSession.findMany({ where: { userId, status: "connected" } }); },
  async getConnectionHistory(userId: string, limit: number = 50) { return prisma.remoteSession.findMany({ where: { userId }, orderBy: { startedAt: "desc" }, take: limit }); },
};
