import crypto from "crypto";
import { prisma } from "../../lib/prisma.js";
export const apiKeyService = {
  async generateApiKey(userId: string, name: string, permissions: string[], expiresInDays?: number) {
    const key = `rdk_${crypto.randomBytes(32).toString("hex")}`;
    const hashedKey = crypto.createHash("sha256").update(key).digest("hex");
    const expiresAt = expiresInDays ? new Date(Date.now() + expiresInDays * 86400000) : null;
    await prisma.apiKey.create({ data: { userId, name, hashedKey, permissions, expiresAt } });
    return { key, name, permissions, expiresAt };
  },
  async validateApiKey(key: string) {
    const hashedKey = crypto.createHash("sha256").update(key).digest("hex");
    const apiKey = await prisma.apiKey.findUnique({ where: { hashedKey } });
    if (!apiKey || (apiKey.expiresAt && apiKey.expiresAt < new Date())) return null;
    await prisma.apiKey.update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date(), usageCount: { increment: 1 } } });
    return apiKey;
  },
  async revokeApiKey(keyId: string) { return prisma.apiKey.delete({ where: { id: keyId } }); },
  async listApiKeys(userId: string) { return prisma.apiKey.findMany({ where: { userId }, select: { id: true, name: true, permissions: true, createdAt: true, lastUsedAt: true, usageCount: true, expiresAt: true } }); },
};
