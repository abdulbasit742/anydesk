export interface FileTransferPolicy {
  enabled: boolean;
  maxFileBytes: number;
  maxConcurrentTransfers: number;
  warnAboveBytes: number;
  blockedExtensions: Set<string>;
  warnedExtensions: Set<string>;
  requireReceiverConfirmation: boolean;
}

export interface FilePolicyDecision {
  allowed: boolean;
  requiresWarning: boolean;
  reasons: string[];
}

export const DEFAULT_FILE_TRANSFER_POLICY: FileTransferPolicy = {
  enabled: false,
  maxFileBytes: 1024 * 1024 * 1024,
  warnAboveBytes: 250 * 1024 * 1024,
  maxConcurrentTransfers: 2,
  blockedExtensions: new Set(['exe', 'msi', 'bat', 'cmd', 'ps1', 'scr', 'com', 'vbs', 'js', 'jar', 'app', 'pkg', 'dmg']),
  warnedExtensions: new Set(['zip', '7z', 'rar', 'tar', 'gz', 'iso', 'dll', 'sh']),
  requireReceiverConfirmation: true,
};

export function extensionOf(fileName: string): string {
  const last = fileName.split('/').pop()?.split('\\').pop() ?? fileName;
  const dot = last.lastIndexOf('.');
  return dot >= 0 ? last.slice(dot + 1).toLowerCase() : '';
}

export function evaluateFileAgainstPolicy(
  file: { name: string; size: number },
  policy: FileTransferPolicy = DEFAULT_FILE_TRANSFER_POLICY,
): FilePolicyDecision {
  const reasons: string[] = [];
  let allowed = true;
  let requiresWarning = false;
  if (!policy.enabled) {
    allowed = false;
    reasons.push('File transfer is disabled in desktop settings.');
  }
  if (file.size > policy.maxFileBytes) {
    allowed = false;
    reasons.push(`File exceeds maximum size of ${policy.maxFileBytes} bytes.`);
  }
  if (file.size > policy.warnAboveBytes) {
    requiresWarning = true;
    reasons.push('Large file transfer may take a long time and can affect session quality.');
  }
  const ext = extensionOf(file.name);
  if (ext && policy.blockedExtensions.has(ext)) {
    allowed = false;
    reasons.push(`Files with .${ext} extension are blocked by policy.`);
  }
  if (ext && policy.warnedExtensions.has(ext)) {
    requiresWarning = true;
    reasons.push(`Files with .${ext} extension should only be accepted from trusted users.`);
  }
  return { allowed, requiresWarning, reasons };
}
