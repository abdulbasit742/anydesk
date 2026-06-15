import type { TeamPermission, TeamRole } from './teamTypes.js';

export const ROLE_PERMISSIONS: Record<TeamRole, readonly TeamPermission[]> = {
  owner: ['session:view','session:start','session:control','device:view','device:manage','team:view','team:invite','team:manage_roles','billing:view','billing:manage','audit:view','support:view','support:respond','security:manage'],
  admin: ['session:view','session:start','session:control','device:view','device:manage','team:view','team:invite','team:manage_roles','billing:view','audit:view','support:view','support:respond','security:manage'],
  support: ['session:view','device:view','team:view','audit:view','support:view','support:respond'],
  member: ['session:view','session:start','device:view','team:view','support:view'],
  viewer: ['session:view','device:view','team:view'],
};

export function permissionsForRole(role: TeamRole): readonly TeamPermission[] {
  return ROLE_PERMISSIONS[role];
}
