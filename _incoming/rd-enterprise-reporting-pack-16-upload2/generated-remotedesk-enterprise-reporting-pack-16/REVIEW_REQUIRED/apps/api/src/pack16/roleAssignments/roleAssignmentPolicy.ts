const ROLE_RANK: Record<string, number> = { owner: 100, admin: 80, support: 60, billing: 55, auditor: 50, member: 20, viewer: 10 };

export function roleAssignmentAllowed(assignerRole: string, targetRole: string): boolean {
  if (assignerRole === "owner") return true;
  if (assignerRole === "admin") return (ROLE_RANK[targetRole] ?? 0) < ROLE_RANK.admin;
  return false;
}
