export type DeviceTrustStatus = 'trusted' | 'untrusted' | 'blocked';
export type FeaturePermissionState = 'enabled' | 'disabled' | 'blocked';

export interface DeviceAccessPolicySnapshot {
  deviceId: string;
  trustStatus: DeviceTrustStatus;
  unattendedAccessEnabled: boolean;
  remoteInputEnabled: boolean;
  clipboardSyncEnabled: boolean;
  fileTransferEnabled: boolean;
  requiresSessionApproval: boolean;
  maxSessionMinutes: number | null;
  updatedAt: string;
}

export interface SessionPermissionSet {
  deviceId: string;
  remoteInput: FeaturePermissionState;
  clipboardSync: FeaturePermissionState;
  fileTransfer: FeaturePermissionState;
  sessionExpiresAt: string | null;
  emergencyStopped: boolean;
  version: number;
  updatedAt: string;
}

export type PolicyDenialReason =
  | 'device_blocked'
  | 'device_untrusted'
  | 'missing_policy'
  | 'feature_disabled_by_policy'
  | 'host_not_accepted'
  | 'emergency_stop_active'
  | 'session_expired';

export interface PolicyEvaluationResult {
  allowed: boolean;
  reason?: PolicyDenialReason;
  message: string;
}

export interface BuildSessionPermissionSetInput {
  policy: DeviceAccessPolicySnapshot | null;
  hostAccepted: boolean;
  emergencyStopped: boolean;
  startedAt?: Date;
  now?: Date;
  version: number;
}
