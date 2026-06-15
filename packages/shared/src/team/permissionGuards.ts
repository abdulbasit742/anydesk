import type { TeamInvite, TeamMembership, TeamPermission } from './teamTypes.js';
import { hasPermission } from './permissions.js';

export function canInviteMember(actor: TeamMembership, inviteRole: TeamInvite['role']): boolean {
  if (!hasPermission(actor, 'team:invite')) return false;
  if (actor.role === 'admin' && inviteRole === 'owner') return false;
  return true;
}

export function missingPermissions(actor: TeamMembership, required: readonly TeamPermission[]): readonly TeamPermission[] {
  return required.filter((permission) => !hasPermission(actor, permission));
}
