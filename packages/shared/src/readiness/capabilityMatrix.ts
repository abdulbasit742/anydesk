export interface CapabilityMatrix {
  fileTransfer: boolean;
  clipboardSync: boolean;
  remoteInput: boolean;
  supportBundle: boolean;
  diagnostics: boolean;
  reconnect: boolean;
}

export function mergeCapabilityMatrix(base: CapabilityMatrix, override: Partial<CapabilityMatrix>): CapabilityMatrix {
  return { ...base, ...override, remoteInput: base.remoteInput && override.remoteInput === true };
}

export const SAFE_DEFAULT_CAPABILITIES: CapabilityMatrix = {
  fileTransfer: true,
  clipboardSync: false,
  remoteInput: false,
  supportBundle: true,
  diagnostics: true,
  reconnect: true
};
