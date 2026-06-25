import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { prisma } from "../lib/prisma.js";
import * as OTPAuth from "otpauth";
import * as QRCode from "qrcode";

const router = Router();
router.use(requireAuth);

/**
 * POST /api/2fa/setup
 * Generate a new TOTP secret and return QR code + secret for the user to scan
 */
router.post("/setup", asyncHandler<AuthedRequest>(async (req, res) => {
  const userId = req.user!.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ success: false, error: "User not found" });

  // Generate a new TOTP secret
  const totp = new OTPAuth.TOTP({
    issuer: "RemoteDesk",
    label: user.email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: new OTPAuth.Secret({ size: 20 }),
  });

  const secret = totp.secret.base32;
  const otpauthUrl = totp.toString();

  // Store secret temporarily (not yet verified)
  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorSecret: secret, twoFactorEnabled: false },
  });

  // Generate QR code as data URL
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

  res.json({
    success: true,
    data: {
      secret,
      qrCode: qrCodeDataUrl,
      otpauthUrl,
    },
  });
}));

/**
 * POST /api/2fa/verify
 * Verify the TOTP code and enable 2FA
 */
router.post("/verify", asyncHandler<AuthedRequest>(async (req, res) => {
  const userId = req.user!.id;
  const { code } = req.body as { code?: string };

  if (!code || code.length !== 6) {
    return res.status(400).json({ success: false, error: "Invalid code format" });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.twoFactorSecret) {
    return res.status(400).json({ success: false, error: "2FA not set up" });
  }

  const totp = new OTPAuth.TOTP({
    issuer: "RemoteDesk",
    label: user.email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
  });

  const delta = totp.validate({ token: code, window: 1 });
  if (delta === null) {
    return res.status(401).json({ success: false, error: "Invalid verification code" });
  }

  // Generate backup codes
  const backupCodes = Array.from({ length: 8 }, () =>
    Math.random().toString(36).slice(2, 8).toUpperCase()
  );

  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: true,
      twoFactorBackupCodes: JSON.stringify(backupCodes),
    },
  });

  res.json({
    success: true,
    data: {
      enabled: true,
      backupCodes,
    },
  });
}));

/**
 * POST /api/2fa/validate
 * Validate a TOTP code during login (called after password auth)
 */
router.post("/validate", asyncHandler<AuthedRequest>(async (req, res) => {
  const userId = req.user!.id;
  const { code } = req.body as { code?: string };

  if (!code) {
    return res.status(400).json({ success: false, error: "Code required" });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
    return res.status(400).json({ success: false, error: "2FA not enabled" });
  }

  // Check if it's a backup code
  const backupCodes: string[] = JSON.parse(user.twoFactorBackupCodes || "[]");
  const backupIndex = backupCodes.indexOf(code.toUpperCase());
  if (backupIndex !== -1) {
    // Consume backup code
    backupCodes.splice(backupIndex, 1);
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorBackupCodes: JSON.stringify(backupCodes) },
    });
    return res.json({ success: true, data: { valid: true, method: "backup_code" } });
  }

  // Validate TOTP
  const totp = new OTPAuth.TOTP({
    issuer: "RemoteDesk",
    label: user.email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
  });

  const delta = totp.validate({ token: code, window: 1 });
  if (delta === null) {
    return res.status(401).json({ success: false, error: "Invalid code" });
  }

  res.json({ success: true, data: { valid: true, method: "totp" } });
}));

/**
 * DELETE /api/2fa/disable
 * Disable 2FA for the user
 */
router.delete("/disable", asyncHandler<AuthedRequest>(async (req, res) => {
  const userId = req.user!.id;

  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: null,
    },
  });

  res.json({ success: true, data: { enabled: false } });
}));

/**
 * GET /api/2fa/status
 * Check if 2FA is enabled for the current user
 */
router.get("/status", asyncHandler<AuthedRequest>(async (req, res) => {
  const userId = req.user!.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorEnabled: true },
  });

  res.json({ success: true, data: { enabled: user?.twoFactorEnabled ?? false } });
}));

export default router;
