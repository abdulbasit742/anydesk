import type { WebRtcLifecycleState } from './peerConnectionLifecycle.js';
import type { WebRtcQuality } from './webrtcStatsTypes.js';

export type WebRtcRecoveryAction = 'none' | 'wait' | 'renegotiate' | 'restart-ice' | 'end-session';

export type WebRtcRecoveryPolicy = {
  readonly reconnectGraceMs: number;
  readonly failedGraceMs: number;
  readonly maxIceRestartAttempts: number;
};

export type WebRtcRecoveryInput = {
  readonly lifecycleState: WebRtcLifecycleState;
  readonly quality: WebRtcQuality;
  readonly disconnectedForMs: number;
  readonly failedForMs: number;
  readonly iceRestartAttempts: number;
  readonly policy?: Partial<WebRtcRecoveryPolicy>;
};

export const DEFAULT_WEBRTC_RECOVERY_POLICY: WebRtcRecoveryPolicy = {
  reconnectGraceMs: 5_000,
  failedGraceMs: 10_000,
  maxIceRestartAttempts: 2,
};

export function resolveWebRtcRecoveryPolicy(policy: Partial<WebRtcRecoveryPolicy> = {}): WebRtcRecoveryPolicy {
  return {
    reconnectGraceMs: policy.reconnectGraceMs ?? DEFAULT_WEBRTC_RECOVERY_POLICY.reconnectGraceMs,
    failedGraceMs: policy.failedGraceMs ?? DEFAULT_WEBRTC_RECOVERY_POLICY.failedGraceMs,
    maxIceRestartAttempts: policy.maxIceRestartAttempts ?? DEFAULT_WEBRTC_RECOVERY_POLICY.maxIceRestartAttempts,
  };
}

export function getWebRtcRecoveryAction(input: WebRtcRecoveryInput): WebRtcRecoveryAction {
  const policy = resolveWebRtcRecoveryPolicy(input.policy);
  const canRestartIce = input.iceRestartAttempts < policy.maxIceRestartAttempts;

  if (input.lifecycleState === 'closed') {
    return 'none';
  }

  if (input.lifecycleState === 'failed') {
    if (input.failedForMs < policy.failedGraceMs) {
      return 'wait';
    }

    return canRestartIce ? 'restart-ice' : 'end-session';
  }

  if (input.lifecycleState === 'reconnecting') {
    if (input.disconnectedForMs < policy.reconnectGraceMs) {
      return 'wait';
    }

    return canRestartIce ? 'restart-ice' : 'renegotiate';
  }

  if (input.lifecycleState === 'connected' && (input.quality === 'degraded' || input.quality === 'poor')) {
    return canRestartIce ? 'restart-ice' : 'renegotiate';
  }

  return 'none';
}

export function shouldKeepWebRtcSession(action: WebRtcRecoveryAction): boolean {
  return action !== 'end-session';
}
