export interface EnterprisePolicy {
  fileTransferEnabled: boolean;
  clipboardSyncEnabled: boolean;
  remoteInputEnabled: boolean;
  requireMfaForRemoteControl: boolean;
  maxSessionMinutes: number;
  allowPersonalDevices: boolean;
}

export const SECURE_DEFAULT_ENTERPRISE_POLICY: EnterprisePolicy = {
  fileTransferEnabled: true,
  clipboardSyncEnabled: false,
  remoteInputEnabled: false,
  requireMfaForRemoteControl: true,
  maxSessionMinutes: 120,
  allowPersonalDevices: false
};

export function mergeEnterprisePolicy(input: Partial<EnterprisePolicy>): EnterprisePolicy {
  return {
    ...SECURE_DEFAULT_ENTERPRISE_POLICY,
    ...input,
    remoteInputEnabled: input.remoteInputEnabled === true && input.requireMfaForRemoteControl !== false
  };
}
