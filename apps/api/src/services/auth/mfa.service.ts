import crypto from "crypto";
import { prisma } from "../../lib/prisma.js";
export const mfaService = {
  generateTOTPSecret(): { secret: string; qrCodeUrl: string } {
    const secret = crypto.randomBytes(20).toString("base32");
    const qrCodeUrl = `otpauth://totp/RemoteDesk?secret=${secret}&issuer=RemoteDesk`;
    return { secret, qrCodeUrl };
  },
  verifyTOTP(secret: string, token: string): boolean {
    const timeStep = Math.floor(Date.now() / 30000);
    for (let i = -1; i <= 1; i++) {
      const hmac = crypto.createHmac("sha1", Buffer.from(secret, "base32"));
      hmac.update(Buffer.from(((timeStep + i) >>> 0).toString(16).padStart(16, "0"), "hex"));
      const hash = hmac.digest();
      const offset = hash[hash.length - 1] & 0xf;
      const code = ((hash[offset] & 0x7f) << 24 | (hash[offset + 1] & 0xff) << 16 | (hash[offset + 2] & 0xff) << 8 | (hash[offset + 3] & 0xff)) % 1000000;
      if (code.toString().padStart(6, "0") === token) return true;
    }
    return false;
  },
  async enableMFA(userId: string, secret: string) {
    return prisma.user.update({ where: { id: userId }, data: { mfaEnabled: true, mfaSecret: secret } });
  },
  async disableMFA(userId: string) {
    return prisma.user.update({ where: { id: userId }, data: { mfaEnabled: false, mfaSecret: null } });
  },
  generateBackupCodes(): string[] {
    return Array.from({ length: 10 }, () => crypto.randomBytes(4).toString("hex"));
  },
  async storeBackupCodes(userId: string, codes: string[]) {
    const hashed = codes.map(c => crypto.createHash("sha256").update(c).digest("hex"));
    return prisma.user.update({ where: { id: userId }, data: { backupCodes: hashed } });
  },
};
