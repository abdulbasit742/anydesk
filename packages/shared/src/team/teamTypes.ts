export type TeamRole = 'owner' | 'admin' | 'support' | 'member' | 'viewer';
export type TeamPermission =
  | 'session:view'
  | 'session:start'
  | 'session:control'
  | 'device:view'
  | 'device:manage'
  | 'team:view'
  | 'team:invite'
  | 'team:manage_roles'
  | 'billing:view'
  | 'billing:manage'
  | 'audit:view'
  | 'support:view'
  | 'support:respond'
  | 'security:manage';

export type TeamMembership = {
  readonly userId: string;
  readonly organizationId: string;
  readonly role: TeamRole;
  readonly permissionsOverride?: readonly TeamPermission[];
};

export type TeamInvite = {
  readonly id: string;
  readonly organizationId: string;
  readonly email: string;
  readonly role: TeamRole;
  readonly invitedByUserId: string;
  readonly expiresAtMs: number;
  readonly acceptedAtMs?: number;
  readonly revokedAtMs?: number;
};
