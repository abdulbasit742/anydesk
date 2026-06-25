export type ClipboardSyncDirection = 'push' | 'pull';

export type ClipboardContentKind = 'text' | 'unknown';

export type ClipboardSyncReadinessInput = {
  readonly direction: ClipboardSyncDirection;
  readonly contentKind: ClipboardContentKind;
  readonly contentBytes: number;
  readonly maxContentBytes: number;
  readonly sessionActive: boolean;
  readonly channelReady: boolean;
  readonly featureEnabled: boolean;
  readonly userConsent: boolean;
  readonly peerTrusted: boolean;
};

export type ClipboardSyncBlockReason =
  | 'none'
  | 'unsupported-content'
  | 'empty-content'
  | 'content-too-large'
  | 'session-inactive'
  | 'channel-not-ready'
  | 'feature-disabled'
  | 'missing-consent'
  | 'peer-not-trusted';

export type ClipboardSyncReadiness = ClipboardSyncReadinessInput & {
  readonly canSync: boolean;
  readonly blockReason: ClipboardSyncBlockReason;
};

export function getClipboardSyncReadiness(input: ClipboardSyncReadinessInput): ClipboardSyncReadiness {
  if (input.contentKind !== 'text') {
    return { ...input, canSync: false, blockReason: 'unsupported-content' };
  }

  if (!Number.isFinite(input.contentBytes) || input.contentBytes <= 0) {
    return { ...input, canSync: false, blockReason: 'empty-content' };
  }

  if (input.contentBytes > input.maxContentBytes) {
    return { ...input, canSync: false, blockReason: 'content-too-large' };
  }

  if (!input.sessionActive) {
    return { ...input, canSync: false, blockReason: 'session-inactive' };
  }

  if (!input.channelReady) {
    return { ...input, canSync: false, blockReason: 'channel-not-ready' };
  }

  if (!input.featureEnabled) {
    return { ...input, canSync: false, blockReason: 'feature-disabled' };
  }

  if (!input.userConsent) {
    return { ...input, canSync: false, blockReason: 'missing-consent' };
  }

  if (!input.peerTrusted) {
    return { ...input, canSync: false, blockReason: 'peer-not-trusted' };
  }

  return { ...input, canSync: true, blockReason: 'none' };
}

export function isClipboardSyncBlocked(readiness: ClipboardSyncReadiness): boolean {
  return !readiness.canSync;
}
