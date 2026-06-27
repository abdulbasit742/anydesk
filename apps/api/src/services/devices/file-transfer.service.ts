import crypto from "crypto";
import { prisma } from "../../lib/prisma.js";
export const fileTransferService = {
  async initiateTransfer(sessionId: string, files: Array<{ name: string; size: number; path: string }>) {
    const transferId = crypto.randomUUID();
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    return prisma.fileTransfer.create({ data: { id: transferId, sessionId, files: JSON.stringify(files), totalSize, transferredSize: 0, status: "pending", startedAt: new Date() } });
  },
  async updateProgress(transferId: string, transferredSize: number) {
    const transfer = await prisma.fileTransfer.findUnique({ where: { id: transferId } });
    if (!transfer) throw new Error("Transfer not found");
    const progress = (transferredSize / transfer.totalSize) * 100;
    return prisma.fileTransfer.update({ where: { id: transferId }, data: { transferredSize, progress, status: progress >= 100 ? "completed" : "transferring" } });
  },
  async cancelTransfer(transferId: string) { return prisma.fileTransfer.update({ where: { id: transferId }, data: { status: "cancelled", endedAt: new Date() } }); },
  async getTransferHistory(sessionId: string) { return prisma.fileTransfer.findMany({ where: { sessionId }, orderBy: { startedAt: "desc" } }); },
  async calculateTransferSpeed(transferId: string): Promise<number> {
    const transfer = await prisma.fileTransfer.findUnique({ where: { id: transferId } });
    if (!transfer) return 0;
    const elapsed = (Date.now() - transfer.startedAt.getTime()) / 1000;
    return elapsed > 0 ? transfer.transferredSize / elapsed : 0;
  },
};
