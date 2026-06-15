export interface SessionPolicy {
  maxDurationMinutes: number;
  allowFileTransfer: boolean;
  allowClipboardSync: boolean;
  allowRemoteInput: boolean;
  requireHostApproval: boolean;
  requireViewerMfa: boolean;
}

export const DEFAULT_SAFE_SESSION_POLICY: SessionPolicy = {
  maxDurationMinutes: 120,
  allowFileTransfer: true,
  allowClipboardSync: false,
  allowRemoteInput: false,
  requireHostApproval: true,
  requireViewerMfa: true
};

export function validateSessionPolicy(policy: SessionPolicy): string[] {
  const errors: string[] = [];
  if (policy.maxDurationMinutes < 1 || policy.maxDurationMinutes > 720) errors.push("max-duration-out-of-range");
  if (policy.allowRemoteInput && !policy.requireHostApproval) errors.push("remote-input-requires-host-approval");
  if (policy.allowRemoteInput && !policy.requireViewerMfa) errors.push("remote-input-requires-viewer-mfa");
  return errors;
}
