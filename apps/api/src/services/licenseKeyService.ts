import crypto from "crypto";
import { prisma } from "../lib/prisma.js";

export class LicenseKeyService {
  /**
   * Generate a new license key
   */
  async generateLicenseKey(
    userId: string,
    plan: string,
    maxDevices: number,
    expiresInDays?: number
  ): Promise<string> {
    // Generate cryptographically secure key
    const key = this.generateKey();

    let expiresAt = null;
    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    await prisma.licenseKey.create({
      data: {
        key,
        userId,
        plan: plan as any,
        maxDevices,
        expiresAt,
        status: "active",
      },
    });

    return key;
  }

  /**
   * Validate a license key
   */
  async validateLicenseKey(key: string): Promise<{ valid: boolean; data?: any; error?: string }> {
    const licenseKey = await prisma.licenseKey.findUnique({
      where: { key },
      include: { user: true },
    });

    if (!licenseKey) {
      return { valid: false, error: "License key not found" };
    }

    if (licenseKey.status !== "active") {
      return { valid: false, error: "License key is not active" };
    }

    if (licenseKey.expiresAt && licenseKey.expiresAt < new Date()) {
      return { valid: false, error: "License key has expired" };
    }

    return {
      valid: true,
      data: {
        id: licenseKey.id,
        plan: licenseKey.plan,
        maxDevices: licenseKey.maxDevices,
        expiresAt: licenseKey.expiresAt,
        user: {
          id: licenseKey.user.id,
          email: licenseKey.user.email,
        },
      },
    };
  }

  /**
   * Activate license key on device
   */
  async activateLicenseKey(
    licenseKeyId: string,
    deviceId: string,
    hardwareId: string
  ): Promise<{ success: boolean; error?: string }> {
    const licenseKey = await prisma.licenseKey.findUnique({
      where: { id: licenseKeyId },
    });

    if (!licenseKey) {
      return { success: false, error: "License key not found" };
    }

    if (licenseKey.status !== "active") {
      return { success: false, error: "License key is not active" };
    }

    // Check if already activated on this hardware
    const existing = await prisma.licenseActivation.findUnique({
      where: { licenseKeyId_hardwareId: { licenseKeyId, hardwareId } },
    });

    if (existing) {
      return { success: true };
    }

    // Check device limit
    const activationCount = await prisma.licenseActivation.count({
      where: { licenseKeyId },
    });

    if (activationCount >= licenseKey.maxDevices) {
      return { success: false, error: "Device limit reached for this license" };
    }

    // Create activation
    await prisma.licenseActivation.create({
      data: {
        licenseKeyId,
        deviceId,
        hardwareId,
      },
    });

    return { success: true };
  }

  /**
   * Check if device is activated
   */
  async checkDeviceActivation(hardwareId: string): Promise<{ activated: boolean; license?: any }> {
    const activation = await prisma.licenseActivation.findFirst({
      where: { hardwareId },
      include: {
        licenseKey: {
          include: { user: true },
        },
      },
    });

    if (!activation) {
      return { activated: false };
    }

    const licenseKey = activation.licenseKey;

    // Check if license is still valid
    if (licenseKey.status !== "active") {
      return { activated: false };
    }

    if (licenseKey.expiresAt && licenseKey.expiresAt < new Date()) {
      return { activated: false };
    }

    return {
      activated: true,
      license: {
        id: licenseKey.id,
        plan: licenseKey.plan,
        expiresAt: licenseKey.expiresAt,
      },
    };
  }

  /**
   * Revoke license key
   */
  async revokeLicenseKey(licenseKeyId: string): Promise<void> {
    await prisma.licenseKey.update({
      where: { id: licenseKeyId },
      data: { status: "revoked" },
    });
  }

  /**
   * List user's license keys
   */
  async getUserLicenseKeys(userId: string): Promise<any[]> {
    return prisma.licenseKey.findMany({
      where: { userId },
      select: {
        id: true,
        key: true,
        plan: true,
        maxDevices: true,
        status: true,
        expiresAt: true,
        createdAt: true,
        _count: {
          select: { activations: true },
        },
      },
    });
  }

  /**
   * Generate cryptographically secure key
   */
  private generateKey(): string {
    // Format: XXXX-XXXX-XXXX-XXXX-XXXX
    const segments = [];
    for (let i = 0; i < 5; i++) {
      const segment = crypto.randomBytes(2).toString("hex").toUpperCase();
      segments.push(segment);
    }
    return segments.join("-");
  }
}

export const licenseKeyService = new LicenseKeyService();
