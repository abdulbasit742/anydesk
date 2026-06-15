export type OrgRole = "owner" | "admin" | "support" | "billing" | "auditor" | "member" | "viewer";

export function orgRoleRank(role: OrgRole): number {
  return { owner: 100, admin: 80, support: 60, billing: 55, auditor: 50, member: 20, viewer: 10 }[role];
}

export function canAssignOrgRole(assigner: OrgRole, target: OrgRole): boolean {
  if (assigner === "owner") return true;
  if (assigner === "admin") return orgRoleRank(target) < orgRoleRank("admin");
  return false;
}
