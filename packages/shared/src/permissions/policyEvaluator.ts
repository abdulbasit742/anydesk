import type {
  BuildSessionPermissionSetInput,
  DeviceAccessPolicySnapshot,
  FeaturePermissionState,
  PolicyDenialReason,
  PolicyEvaluationResult,
  SessionPermissionSet
} from './devicePolicy.js';

export function evaluateSessionStartPolicy(
  policy: DeviceAccessPolicySnapshot | null,
  hostAccepted: boolean
): PolicyEvaluationResult {
  if (!policy) return deny('missing_policy');
  if (policy.trustStatus === 'blocked') return deny('device_blocked');
  if (policy.trustStatus === 'untrusted' && policy.requiresSessionApproval && !hostAccepted) {
    return deny('host_not_accepted');
  }
  return allow('Session policy allows screen sharing. Risky features remain separately gated.');
}

export function canEnableRemoteInput(
  policy: DeviceAccessPolicySnapshot | null,
  options: { hostAccepted: boolean; emergencyStopped: boolean; now?: Date; sessionExpiresAt?: string | null }
): PolicyEvaluationResult {
  const base = evaluateFeature(policy, 'remoteInputEnabled', options.hostAccepted, options.emergencyStopped);
  if (!base.allowed) return base;
  if (isSessionExpired(options.sessionExpiresAt ?? null, options.now)) return deny('session_expired');
  return allow('Remote input is allowed by host policy.');
}

export function canEnableClipboard(
  policy: DeviceAccessPolicySnapshot | null,
  hostAccepted: boolean,
  sessionExpiresAt?: string | null,
  now?: Date
): PolicyEvaluationResult {
  const base = evaluateFeature(policy, 'clipboardSyncEnabled', hostAccepted, false);
  if (!base.allowed) return base;
  if (isSessionExpired(sessionExpiresAt ?? null, now)) return deny('session_expired');
  return allow('Clipboard sync is allowed by host policy.');
}

export function canEnableFileTransfer(
  policy: DeviceAccessPolicySnapshot | null,
  hostAccepted: boolean,
  sessionExpiresAt?: string | null,
  now?: Date
): PolicyEvaluationResult {
  const base = evaluateFeature(policy, 'fileTransferEnabled', hostAccepted, false);
  if (!base.allowed) return base;
  if (isSessionExpired(sessionExpiresAt ?? null, now)) return deny('session_expired');
  return allow('File transfer is allowed by host policy.');
}

export function buildSessionPermissionSet(input: BuildSessionPermissionSetInput): SessionPermissionSet | null {
  if (!input.policy) return null;
  const now = input.now ?? new Date();
  const sessionExpiresAt = deriveSessionExpiry(input.policy, input.startedAt ?? now);
  const expired = isSessionExpired(sessionExpiresAt, now);
  const blocked = input.policy.trustStatus === 'blocked';
  const untrusted = input.policy.trustStatus === 'untrusted';

  return {
    deviceId: input.policy.deviceId,
    remoteInput: featureState(input.policy.remoteInputEnabled, blocked || untrusted || input.emergencyStopped || expired),
    clipboardSync: featureState(input.policy.clipboardSyncEnabled, blocked || untrusted || expired),
    fileTransfer: featureState(input.policy.fileTransferEnabled, blocked || untrusted || expired),
    sessionExpiresAt,
    emergencyStopped: input.emergencyStopped,
    version: input.version,
    updatedAt: now.toISOString()
  };
}

export function deriveSessionExpiry(policy: DeviceAccessPolicySnapshot | null, startedAt: Date = new Date()) {
  if (!policy?.maxSessionMinutes || policy.maxSessionMinutes <= 0) return null;
  return new Date(startedAt.getTime() + policy.maxSessionMinutes * 60_000).toISOString();
}

export function isSessionExpired(sessionExpiresAt: string | null, now: Date = new Date()) {
  if (!sessionExpiresAt) return false;
  const expiresAt = Date.parse(sessionExpiresAt);
  return Number.isFinite(expiresAt) && expiresAt <= now.getTime();
}

export function getPolicyDenialMessage(reason?: PolicyDenialReason) {
  switch (reason) {
    case 'device_blocked':
      return 'This device is blocked by policy.';
    case 'device_untrusted':
      return 'This device is not trusted yet.';
    case 'missing_policy':
      return 'Device policy is unavailable, so controlled features stay disabled.';
    case 'feature_disabled_by_policy':
      return 'This feature is disabled by device policy.';
    case 'host_not_accepted':
      return 'The host has not approved this session.';
    case 'emergency_stop_active':
      return 'Emergency stop is active.';
    case 'session_expired':
      return 'This session has expired by policy.';
    default:
      return 'Policy allowed.';
  }
}

function evaluateFeature(
  policy: DeviceAccessPolicySnapshot | null,
  key: 'remoteInputEnabled' | 'clipboardSyncEnabled' | 'fileTransferEnabled',
  hostAccepted: boolean,
  emergencyStopped: boolean
): PolicyEvaluationResult {
  const sessionStart = evaluateSessionStartPolicy(policy, hostAccepted);
  if (!sessionStart.allowed) return sessionStart;
  if (emergencyStopped) return deny('emergency_stop_active');
  if (!policy?.[key]) return deny('feature_disabled_by_policy');
  if (policy.trustStatus === 'untrusted') return deny('device_untrusted');
  return allow('Feature allowed.');
}

function featureState(enabled: boolean, blocked: boolean): FeaturePermissionState {
  if (blocked) return 'blocked';
  return enabled ? 'enabled' : 'disabled';
}

function allow(message: string): PolicyEvaluationResult {
  return { allowed: true, message };
}

function deny(reason: PolicyDenialReason): PolicyEvaluationResult {
  return { allowed: false, reason, message: getPolicyDenialMessage(reason) };
}
