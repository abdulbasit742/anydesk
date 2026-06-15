export function csvExportAllowed(input: { role: string; rows: number }): { allowed: boolean; reason: string } {
  if (!["owner", "admin", "auditor", "billing"].includes(input.role)) return { allowed: false, reason: "role-not-allowed" };
  if (input.rows > 500000) return { allowed: false, reason: "row-limit-exceeded" };
  return { allowed: true, reason: "allowed" };
}
