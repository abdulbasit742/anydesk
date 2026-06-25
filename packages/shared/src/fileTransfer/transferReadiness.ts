export type FileTransferDirection = 'send' | 'receive';

export type FileTransferReadinessInput = {
  readonly direction: FileTransferDirection;
  readonly fileName: string;
  readonly fileSizeBytes: number;
  readonly maxFileSizeBytes: number;
  readonly sessionActive: boolean;
  readonly channelReady: boolean;
  readonly userConsent: boolean;
  readonly featureEnabled: boolean;
};

export type FileTransferBlockReason =
  | 'none'
  | 'missing-file-name'
  | 'invalid-file-size'
  | 'file-too-large'
  | 'session-inactive'
  | 'channel-not-ready'
  | 'missing-consent'
  | 'feature-disabled';

export type FileTransferReadiness = FileTransferReadinessInput & {
  readonly canTransfer: boolean;
  readonly blockReason: FileTransferBlockReason;
};

export function getFileTransferReadiness(input: FileTransferReadinessInput): FileTransferReadiness {
  if (input.fileName.trim().length === 0) {
    return { ...input, canTransfer: false, blockReason: 'missing-file-name' };
  }

  if (!Number.isFinite(input.fileSizeBytes) || input.fileSizeBytes <= 0) {
    return { ...input, canTransfer: false, blockReason: 'invalid-file-size' };
  }

  if (input.fileSizeBytes > input.maxFileSizeBytes) {
    return { ...input, canTransfer: false, blockReason: 'file-too-large' };
  }

  if (!input.sessionActive) {
    return { ...input, canTransfer: false, blockReason: 'session-inactive' };
  }

  if (!input.channelReady) {
    return { ...input, canTransfer: false, blockReason: 'channel-not-ready' };
  }

  if (!input.userConsent) {
    return { ...input, canTransfer: false, blockReason: 'missing-consent' };
  }

  if (!input.featureEnabled) {
    return { ...input, canTransfer: false, blockReason: 'feature-disabled' };
  }

  return { ...input, canTransfer: true, blockReason: 'none' };
}

export function isFileTransferBlocked(readiness: FileTransferReadiness): boolean {
  return !readiness.canTransfer;
}
