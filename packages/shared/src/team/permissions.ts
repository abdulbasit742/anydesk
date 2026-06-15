import type { TeamMembership, TeamPermission, TeamRole } from './teamTypes.js';
import { permissionsForRole } from './rolePermissions.js';

export function hasPermission(roleOrMembership: TeamRole | TeamMembership, permission: TeamPermission): boolean {
  const permissions = typeof roleOrMembership === 'string'
    ? permissionsForRole(roleOrMembership)
    : roleOrMembership.permissionsOverride ?? permissionsForRole(roleOrMembership.role);
  return permissions.includes(permission);
}

export function requirePermission(roleOrMembership: TeamRole | TeamMembership, permission: TeamPermission): void {
  if (!hasPermission(roleOrMembership, permission)) {
    throw new Error(`Missing required permission: ${permission}`);
  }
}
