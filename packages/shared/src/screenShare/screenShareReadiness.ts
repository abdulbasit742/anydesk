export type ScreenShareSourceKind = 'screen' | 'window' | 'browser-tab';

export type ScreenSharePermissionState = 'unknown' | 'prompt' | 'granted' | 'denied';

export type ScreenShareReadinessInput = {
  readonly sourceKind?: ScreenShareSourceKind | null;
  readonly permissionState: ScreenSharePermissionState;
  readonly hasDisplayCaptureSupport: boolean;
  readonly hasActiveSession: boolean;
  readonly hasUserConsent: boolean;
};

export type ScreenShareReadiness = ScreenShareReadinessInput & {
  readonly canStartShare: boolean;
  readonly needsPermissionPrompt: boolean;
};

export function getScreenShareReadiness(input: ScreenShareReadinessInput): ScreenShareReadiness {
  const hasSourceKind = input.sourceKind === 'screen' || input.sourceKind === 'window' || input.sourceKind === 'browser-tab';
  const needsPermissionPrompt = input.permissionState === 'unknown' || input.permissionState === 'prompt';

  return {
    ...input,
    canStartShare:
      hasSourceKind &&
      input.permissionState === 'granted' &&
      input.hasDisplayCaptureSupport &&
      input.hasActiveSession &&
      input.hasUserConsent,
    needsPermissionPrompt,
  };
}

export function shouldShowScreenSharePermissionHelp(readiness: ScreenShareReadiness): boolean {
  return readiness.permissionState === 'denied' || !readiness.hasDisplayCaptureSupport;
}
