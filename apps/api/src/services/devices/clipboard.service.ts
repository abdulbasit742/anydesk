import { prisma } from "../../lib/prisma.js";
export const clipboardService = {
  async syncClipboard(sessionId: string, content: { type: "text" | "image" | "file"; data: string; size: number }) {
    return prisma.clipboardSync.create({ data: { sessionId, contentType: content.type, data: content.data, size: content.size, syncedAt: new Date() } });
  },
  async getClipboardHistory(sessionId: string, limit: number = 20) {
    return prisma.clipboardSync.findMany({ where: { sessionId }, orderBy: { syncedAt: "desc" }, take: limit });
  },
  async clearClipboardHistory(sessionId: string) { return prisma.clipboardSync.deleteMany({ where: { sessionId } }); },
};
