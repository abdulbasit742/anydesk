export function reportRunAllowed(input: { role: string; reportKey: string }): boolean {
  if (input.reportKey.includes("billing")) return ["owner", "admin", "billing", "auditor"].includes(input.role);
  if (input.reportKey.includes("audit")) return ["owner", "admin", "auditor"].includes(input.role);
  return ["owner", "admin", "support", "auditor"].includes(input.role);
}
