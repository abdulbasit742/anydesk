export type SupportPriority = "low" | "normal" | "high" | "urgent";

export function deriveSupportPriority(input: {
  payingCustomer: boolean;
  securityIssue: boolean;
  activeSessionBlocked: boolean;
  dataLossRisk: boolean;
}): SupportPriority {
  if (input.securityIssue || input.dataLossRisk) return "urgent";
  if (input.activeSessionBlocked && input.payingCustomer) return "high";
  if (input.activeSessionBlocked) return "normal";
  return "low";
}
