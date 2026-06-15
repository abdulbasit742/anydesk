/**
 * RemoteDesk Enterprise Policy Engine
 */
export interface Policy { [key: string]: { enabled: boolean; requireApproval?: boolean } | undefined; }
export function resolvePolicy(policies: Policy[]): Policy {
  return policies.reduce((acc, policy) => {
    for (const [key, value] of Object.entries(policy)) { if (value !== undefined) acc[key] = value; }
    return acc;
  }, {} as Policy);
}
export interface User { role: string; teams?: string[]; }
export function hasPermission(user: User, permission: string, _context?: Record<string, unknown>): boolean {
  const matrix: Record<string, string[]> = { super_admin: ["*"], admin: ["admin_dashboard","manage_users","manage_devices","view_sessions","view_audit_logs","manage_policies"], help_desk: ["view_sessions","join_session"], user: [] };
  return (matrix[user.role] || []).includes("*") || (matrix[user.role] || []).includes(permission);
}
