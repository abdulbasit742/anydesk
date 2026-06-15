export interface SessionRecordingPolicy { enabled: boolean; requiresHostConsent: true; requiresViewerNotice: true; maxDurationSeconds: number; }
export const SAFE_DEFAULT_SESSION_RECORDING_POLICY: SessionRecordingPolicy = { enabled: false, requiresHostConsent: true, requiresViewerNotice: true, maxDurationSeconds: 3600 };
export function canStartRecording(policy: SessionRecordingPolicy, consent: { host: boolean; viewerNoticeShown: boolean }): { ok: true } | { ok: false; reason: string } {
  if (!policy.enabled) return { ok: false, reason: 'recording-disabled' };
  if (!consent.host) return { ok: false, reason: 'host-consent-required' };
  if (!consent.viewerNoticeShown) return { ok: false, reason: 'viewer-notice-required' };
  return { ok: true };
}
