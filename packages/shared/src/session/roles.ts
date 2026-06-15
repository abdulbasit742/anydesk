export type SessionRole = 'host' | 'client' | 'observer';

export interface RoleCapabilities {
  canControl: boolean;
  canChat: boolean;
  canTransferFiles: boolean;
  canRequestElevation: boolean;
  canRecord: boolean;
}

export const roleCapabilities: Record<SessionRole, RoleCapabilities> = {
  host: { canControl: true, canChat: true, canTransferFiles: true, canRequestElevation: true, canRecord: true },
  client: { canControl: true, canChat: true, canTransferFiles: true, canRequestElevation: false, canRecord: false },
  observer: { canControl: false, canChat: true, canTransferFiles: false, canRequestElevation: false, canRecord: false },
};

export function hasCapability(role: SessionRole, capability: keyof RoleCapabilities): boolean {
  return roleCapabilities[role][capability];
}


