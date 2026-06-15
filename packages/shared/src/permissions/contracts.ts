export type PermissionAction = 'view' | 'control' | 'chat' | 'file_transfer' | 'clipboard_sync' | 'reboot' | 'record';

export interface PermissionGrant {
  action: PermissionAction;
  granted: boolean;
  requiresApproval: boolean;
  expiresAt?: number;
}

export interface PermissionSet {
  deviceId: string;
  userId: string;
  grants: PermissionGrant[];
  updatedAt: number;
}

export type PermissionScope = 'session' | 'device' | 'team' | 'global';

export interface PermissionRequest {
  id: string;
  scope: PermissionScope;
  action: PermissionAction;
  requestedAt: number;
  approvedAt?: number;
  deniedAt?: number;
  approverId?: string;
}


