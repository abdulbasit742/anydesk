export function retentionRunCanDelete(input: { legalHold: boolean; dryRun: boolean; approved: boolean }): { allowed: boolean; reason: string } {
  if (input.legalHold) return { allowed: false, reason: "legal-hold" };
  if (input.dryRun) return { allowed: false, reason: "dry-run" };
  if (!input.approved) return { allowed: false, reason: "approval-required" };
  return { allowed: true, reason: "allowed" };
}
