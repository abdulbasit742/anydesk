import { policyChangeMetadata, trustChangeMetadata } from "@remotedesk/shared";
import { prisma } from "./prisma.js";
import { writeDeviceAuditEvent } from "./deviceCommands.js";

export type DeviceTrustStatus = "trusted" | "untrusted" | "blocked";

export interface DeviceAccessPolicyPatch {
  unattendedAccessEnabled?: boolean;
  remoteInputEnabled?: boolean;
  clipboardSyncEnabled?: boolean;
  fileTransferEnabled?: boolean;
  requiresSessionApproval?: boolean;
  maxSessionMinutes?: number;
}

type DeviceTrustRecord = {
  id: string;
  deviceId: string;
  status: string;
  reason: string | null;
  trustedAt: Date | null;
  revokedAt: Date | null;
  updatedByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type DeviceAccessPolicyRecord = {
  id: string;
  deviceId: string;
  unattendedAccessEnabled: boolean;
  remoteInputEnabled: boolean;
  clipboardSyncEnabled: boolean;
  fileTransferEnabled: boolean;
  requiresSessionApproval: boolean;
  maxSessionMinutes: number;
  updatedByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function ensureDeviceSecurityState(deviceId: string, actorUserId?: string) {
  const [trust, policy] = await Promise.all([
    prisma.deviceTrust.upsert({
      where: { deviceId },
      update: {},
      create: {
        deviceId,
        status: "untrusted",
        reason: "New devices start untrusted until the account owner explicitly trusts them.",
        updatedByUserId: actorUserId
      }
    }),
    prisma.deviceAccessPolicy.upsert({
      where: { deviceId },
      update: {},
      create: {
        deviceId,
        updatedByUserId: actorUserId
      }
    })
  ]);

  return { trust, policy };
}

export async function getDeviceSecuritySettings(deviceId: string, actorUserId?: string) {
  const state = await ensureDeviceSecurityState(deviceId, actorUserId);
  return serializeDeviceSecuritySettings(state.trust, state.policy);
}

export async function updateDeviceTrust(input: {
  deviceId: string;
  actorUserId: string;
  status: DeviceTrustStatus;
  reason?: string;
}) {
  const now = new Date();
  const previousTrust = await prisma.deviceTrust.findUnique({
    where: { deviceId: input.deviceId }
  });
  const trust = await prisma.deviceTrust.upsert({
    where: { deviceId: input.deviceId },
    update: {
      status: input.status,
      reason: input.reason,
      trustedAt: input.status === "trusted" ? now : null,
      revokedAt: input.status === "trusted" ? null : now,
      updatedByUserId: input.actorUserId
    },
    create: {
      deviceId: input.deviceId,
      status: input.status,
      reason: input.reason,
      trustedAt: input.status === "trusted" ? now : null,
      revokedAt: input.status === "trusted" ? null : now,
      updatedByUserId: input.actorUserId
    }
  });

  if (input.status === "blocked") {
    await prisma.deviceAccessPolicy.upsert({
      where: { deviceId: input.deviceId },
      update: {
        unattendedAccessEnabled: false,
        remoteInputEnabled: false,
        clipboardSyncEnabled: false,
        fileTransferEnabled: false,
        requiresSessionApproval: true,
        updatedByUserId: input.actorUserId
      },
      create: {
        deviceId: input.deviceId,
        unattendedAccessEnabled: false,
        remoteInputEnabled: false,
        clipboardSyncEnabled: false,
        fileTransferEnabled: false,
        requiresSessionApproval: true,
        updatedByUserId: input.actorUserId
      }
    });
  }

  await writeDeviceAuditEvent({
    deviceId: input.deviceId,
    actorUserId: input.actorUserId,
    type: "device.trust.changed",
    message: `Device trust status changed to ${input.status}`,
    metadata: trustChangeMetadata({
      deviceId: input.deviceId,
      from: previousTrust?.status as DeviceTrustStatus | null,
      to: input.status,
      reason: input.reason ?? null
    })
  });

  return trust;
}

export async function updateDeviceAccessPolicy(input: {
  deviceId: string;
  actorUserId: string;
  patch: DeviceAccessPolicyPatch;
}) {
  const { trust } = await ensureDeviceSecurityState(input.deviceId, input.actorUserId);
  const previousPolicy = await prisma.deviceAccessPolicy.findUnique({
    where: { deviceId: input.deviceId }
  });
  if (trust.status === "blocked") {
    throw new Error("Blocked devices cannot enable access features");
  }

  if (input.patch.unattendedAccessEnabled && trust.status !== "trusted") {
    throw new Error("Trust this device before enabling unattended access");
  }

  const policy = await prisma.deviceAccessPolicy.upsert({
    where: { deviceId: input.deviceId },
    update: {
      ...input.patch,
      updatedByUserId: input.actorUserId
    },
    create: {
      deviceId: input.deviceId,
      ...input.patch,
      updatedByUserId: input.actorUserId
    }
  });

  await writeDeviceAuditEvent({
    deviceId: input.deviceId,
    actorUserId: input.actorUserId,
    type: "device.policy.changed",
    message: "Device access policy updated",
    metadata: policyChangeMetadata({
      deviceId: input.deviceId,
      before: policyAuditSnapshot(previousPolicy),
      after: policyAuditSnapshot(policy)
    }) as unknown as import("@prisma/client").Prisma.InputJsonObject
  });

  return policy;
}

function compactPolicyPatch(patch: DeviceAccessPolicyPatch) {
  return Object.fromEntries(Object.entries(patch).filter(([, value]) => value !== undefined)) as Record<string, boolean | number>;
}

function policyAuditSnapshot(policy: DeviceAccessPolicyRecord | null) {
  return {
    unattendedAccessEnabled: policy?.unattendedAccessEnabled ?? null,
    remoteInputEnabled: policy?.remoteInputEnabled ?? null,
    clipboardSyncEnabled: policy?.clipboardSyncEnabled ?? null,
    fileTransferEnabled: policy?.fileTransferEnabled ?? null,
    requiresSessionApproval: policy?.requiresSessionApproval ?? null,
    maxSessionMinutes: policy?.maxSessionMinutes ?? null
  };
}

export function serializeDeviceSecuritySettings(
  trust: DeviceTrustRecord,
  policy: DeviceAccessPolicyRecord
) {
  const trustStatus = trust.status as DeviceTrustStatus;
  const trusted = trustStatus === "trusted";
  const blocked = trustStatus === "blocked";

  return {
    trust: {
      id: trust.id,
      status: trustStatus,
      trusted,
      blocked,
      reason: trust.reason,
      trustedAt: trust.trustedAt,
      revokedAt: trust.revokedAt,
      updatedAt: trust.updatedAt
    },
    accessPolicy: {
      id: policy.id,
      unattendedAccessEnabled: policy.unattendedAccessEnabled,
      remoteInputEnabled: policy.remoteInputEnabled,
      clipboardSyncEnabled: policy.clipboardSyncEnabled,
      fileTransferEnabled: policy.fileTransferEnabled,
      requiresSessionApproval: policy.requiresSessionApproval,
      maxSessionMinutes: policy.maxSessionMinutes,
      updatedAt: policy.updatedAt
    },
    unattendedAccess: {
      enabled: trusted && policy.unattendedAccessEnabled,
      reason: blocked
        ? "Device is blocked. Unattended access is disabled."
        : trusted
          ? policy.unattendedAccessEnabled
            ? "Trusted device can accept unattended sessions under the saved access policy."
            : "Device is trusted, but unattended access is disabled."
          : "Trust this device before unattended access can be enabled."
    },
    remoteInputPolicy: {
      enabled: !blocked && policy.remoteInputEnabled,
      reason: blocked
        ? "Device is blocked. Remote input is disabled."
        : policy.remoteInputEnabled
          ? "Remote input is allowed only inside accepted sessions and still requires host-side controls."
          : "Remote input is disabled for this device."
    }
  };
}
