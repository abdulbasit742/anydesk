export type FileTransferLimitPolicy = {
  readonly maxFileSizeBytes: number;
  readonly warnAtRatio: number;
};

export type FileTransferLimitResult = {
  readonly fileSizeBytes: number;
  readonly maxFileSizeBytes: number;
  readonly ratioUsed: number;
  readonly withinLimit: boolean;
  readonly shouldWarn: boolean;
};

export const DEFAULT_FILE_TRANSFER_LIMIT_POLICY: FileTransferLimitPolicy = {
  maxFileSizeBytes: 100 * 1024 * 1024,
  warnAtRatio: 0.8,
};

export function resolveFileTransferLimitPolicy(
  policy: Partial<FileTransferLimitPolicy> = {},
): FileTransferLimitPolicy {
  const maxFileSizeBytes = Number.isFinite(policy.maxFileSizeBytes) && policy.maxFileSizeBytes! > 0
    ? Math.trunc(policy.maxFileSizeBytes!)
    : DEFAULT_FILE_TRANSFER_LIMIT_POLICY.maxFileSizeBytes;

  const warnAtRatio = Number.isFinite(policy.warnAtRatio) && policy.warnAtRatio! > 0
    ? Math.min(policy.warnAtRatio!, 1)
    : DEFAULT_FILE_TRANSFER_LIMIT_POLICY.warnAtRatio;

  return { maxFileSizeBytes, warnAtRatio };
}

export function getFileTransferLimitResult(
  fileSizeBytes: number,
  policy: Partial<FileTransferLimitPolicy> = {},
): FileTransferLimitResult {
  const resolved = resolveFileTransferLimitPolicy(policy);
  const normalizedSize = Number.isFinite(fileSizeBytes) && fileSizeBytes > 0 ? Math.trunc(fileSizeBytes) : 0;
  const ratioUsed = resolved.maxFileSizeBytes > 0 ? normalizedSize / resolved.maxFileSizeBytes : 1;

  return {
    fileSizeBytes: normalizedSize,
    maxFileSizeBytes: resolved.maxFileSizeBytes,
    ratioUsed,
    withinLimit: normalizedSize > 0 && normalizedSize <= resolved.maxFileSizeBytes,
    shouldWarn: ratioUsed >= resolved.warnAtRatio && ratioUsed <= 1,
  };
}
