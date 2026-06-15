export type ComplianceExportScope = "tenant" | "user" | "device" | "audit" | "billing";

export function exportScopeAllowed(role: string, scope: ComplianceExportScope): boolean {
  if (role === "owner") return true;
  if (role === "admin") return scope !== "billing";
  if (role === "auditor") return ["audit", "tenant", "device"].includes(scope);
  if (role === "billing") return scope === "billing";
  return false;
}
