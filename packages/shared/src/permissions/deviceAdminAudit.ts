import type { DeviceTrustStatus } from "./devicePolicy.js";

export type DeviceAdminFeatureKey =
  | "remoteInput"
  | "clipboardSync"
  | "fileTransfer"
  | "unattendedAccess";

export type DeviceAdminAuditAction =
  | "device.trust.changed"
  | "device.policy.changed"
  | "device.grant.created"
  | "device.grant.revoked"
  | "device.receipt.verify_failed";

export interface DeviceAccessPolicyAuditSnapshot {
  unattendedAccessEnabled: boolean | null;
  remoteInputEnabled: boolean | null;
  clipboardSyncEnabled: boolean | null;
  fileTransferEnabled: boolean | null;
  requiresSessionApproval: boolean | null;
  maxSessionMinutes: number | null;
}

export function trustChangeMetadata(input: {
  deviceId: string;
  from: DeviceTrustStatus | null;
  to: DeviceTrustStatus;
  reason?: string | null;
}) {
  return {
    deviceId: input.deviceId,
    from: input.from ?? "unknown",
    to: input.to,
    reason: input.reason ?? null
  };
}

export function policyChangeMetadata(input: {
  deviceId: string;
  before: DeviceAccessPolicyAuditSnapshot;
  after: DeviceAccessPolicyAuditSnapshot;
}) {
  return {
    deviceId: input.deviceId,
    before: input.before,
    after: input.after
  };
}

export function grantCreateMetadata(input: {
  deviceId: string;
  grantId: string;
  scope: DeviceAdminFeatureKey[];
  notBefore?: string | null;
  expiresAt?: string | null;
}) {
  return {
    deviceId: input.deviceId,
    grantId: input.grantId,
    scope: [...input.scope].sort(),
    notBefore: input.notBefore ?? null,
    expiresAt: input.expiresAt ?? null
  };
}

export function grantRevokeMetadata(input: { deviceId: string; grantId: string }) {
  return {
    deviceId: input.deviceId,
    grantId: input.grantId
  };
}

export function receiptVerifyFailMetadata(input: {
  receiptId: string;
  reason: string;
  firstBrokenSeq?: number | null;
}) {
  return {
    receiptId: input.receiptId,
    reason: input.reason,
    firstBrokenSeq: input.firstBrokenSeq ?? null
  };
}

export function deviceAdminActionLabel(action: string): string {
  switch (action as DeviceAdminAuditAction) {
    case "device.trust.changed":
      return "Trust changed";
    case "device.policy.changed":
      return "Access policy changed";
    case "device.grant.created":
      return "Grant created";
    case "device.grant.revoked":
      return "Grant revoked";
    case "device.receipt.verify_failed":
      return "Receipt verification failed";
    default:
      return action;
  }
}
