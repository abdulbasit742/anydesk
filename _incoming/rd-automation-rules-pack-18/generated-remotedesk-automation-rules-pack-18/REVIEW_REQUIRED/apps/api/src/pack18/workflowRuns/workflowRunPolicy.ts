export function workflowRunCanStart(input: { ruleEnabled: boolean; rateLimited: boolean; approvalRequired: boolean; approvalApproved: boolean }): { allowed: boolean; reason: string } {
  if (!input.ruleEnabled) return { allowed: false, reason: "rule-disabled" };
  if (input.rateLimited) return { allowed: false, reason: "rate-limited" };
  if (input.approvalRequired && !input.approvalApproved) return { allowed: false, reason: "approval-required" };
  return { allowed: true, reason: "allowed" };
}
