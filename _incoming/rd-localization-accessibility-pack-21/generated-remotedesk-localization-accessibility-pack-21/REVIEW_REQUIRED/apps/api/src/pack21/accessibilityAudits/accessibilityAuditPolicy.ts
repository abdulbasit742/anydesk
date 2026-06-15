export function accessibilityAuditBlocksRelease(input: { highIssues: number; criticalIssues: number }): boolean {
  return input.highIssues > 0 || input.criticalIssues > 0;
}
