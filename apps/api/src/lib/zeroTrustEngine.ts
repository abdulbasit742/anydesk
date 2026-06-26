import { prisma } from "./prisma.js";
import crypto from "crypto";

export interface SecurityContext {
  userId?: string;
  deviceId?: string;
  ipAddress?: string;
  location?: string; // Country code
  action: string;
  details?: Record<string, unknown>;
}

export class ZeroTrustEngine {
  // 1. Device Fingerprinting
  static async verifyDeviceFingerprint(deviceId: string, hardwareId: string, tpmHash?: string): Promise<boolean> {
    const fingerprint = await prisma.deviceFingerprint.findUnique({
      where: { deviceId }
    });

    if (!fingerprint) return false;
    if (!fingerprint.approved) return false;
    if (fingerprint.hardwareId !== hardwareId) return false;
    if (tpmHash && fingerprint.tpmHash && fingerprint.tpmHash !== tpmHash) return false;

    return true;
  }

  // 2. Geo-Fencing
  static async checkGeoFence(countryCode: string): Promise<{ allowed: boolean; reason?: string }> {
    const policies = await prisma.geoFencePolicy.findMany({
      where: { enabled: true }
    });

    for (const policy of policies) {
      const countries = policy.countries as string[];
      if (countries.includes(countryCode)) {
        if (policy.action === "block") {
          return { allowed: false, reason: `Blocked by Geo-Fence policy: ${policy.name}` };
        }
      }
    }
    return { allowed: true };
  }

  // 3. Zero-Trust Policy Evaluation
  static async evaluateAccess(context: SecurityContext): Promise<{ allowed: boolean; riskScore: number; reason?: string }> {
    let riskScore = 0;
    let allowed = true;
    let reason: string | undefined;

    // Fetch active policies
    const policies = await prisma.zeroTrustPolicy.findMany();
    
    // Evaluate base risk
    if (!context.deviceId) riskScore += 30;
    if (!context.userId) riskScore += 50;

    // Time-based access
    const now = new Date();
    const currentHour = now.getHours();
    
    for (const policy of policies) {
      // Check time restrictions
      if (policy.allowedHoursStart && policy.allowedHoursEnd) {
        const start = parseInt(policy.allowedHoursStart.split(":")[0]);
        const end = parseInt(policy.allowedHoursEnd.split(":")[0]);
        if (currentHour < start || currentHour >= end) {
          riskScore += 40;
          if (riskScore > policy.maxRiskScore) {
            return { allowed: false, riskScore, reason: "Access denied: Outside allowed hours" };
          }
        }
      }

      // Check device approval requirement
      if (policy.requireApprovedDevice && context.deviceId) {
        const fingerprint = await prisma.deviceFingerprint.findUnique({ where: { deviceId: context.deviceId } });
        if (!fingerprint || !fingerprint.approved) {
          return { allowed: false, riskScore: 100, reason: "Access denied: Device not approved" };
        }
      }
    }

    if (riskScore >= 50) {
      allowed = false;
      reason = "Access denied: Risk score too high";
    }

    return { allowed, riskScore, reason };
  }

  // 4. Immutable Audit Trail (Blockchain-style Hash Chain)
  static async logSecurityEvent(context: SecurityContext, riskScore: number = 0): Promise<void> {
    // Get previous log hash
    const lastLog = await prisma.securityAuditLog.findFirst({
      orderBy: { timestamp: "desc" }
    });

    const previousHash = lastLog?.hash || "0000000000000000000000000000000000000000000000000000000000000000";
    
    // Calculate new hash
    const dataString = JSON.stringify({
      timestamp: new Date().toISOString(),
      action: context.action,
      userId: context.userId,
      deviceId: context.deviceId,
      ipAddress: context.ipAddress,
      previousHash
    });
    
    const hash = crypto.createHash("sha256").update(dataString).digest("hex");

    await prisma.securityAuditLog.create({
      data: {
        action: context.action,
        userId: context.userId,
        deviceId: context.deviceId,
        ipAddress: context.ipAddress,
        location: context.location,
        riskScore,
        details: (context.details || {}) as any,
        previousHash,
        hash
      }
    });
  }

  // 5. Threat Detection
  static async reportThreat(type: string, severity: string, description: string, context: SecurityContext): Promise<void> {
    await prisma.threatAlert.create({
      data: {
        type,
        severity,
        description,
        userId: context.userId,
        deviceId: context.deviceId,
        ipAddress: context.ipAddress
      }
    });

    // Also log to audit trail
    await this.logSecurityEvent({
      ...context,
      action: "THREAT_DETECTED",
      details: { type, severity, description }
    }, severity === "critical" ? 100 : severity === "high" ? 80 : 50);
  }
}
