export type AccessibilitySeverity = "low" | "medium" | "high" | "critical";

export interface AccessibilityIssue {
  id: string;
  severity: AccessibilitySeverity;
  rule: string;
  message: string;
}

export function accessibilityBlocksRelease(issue: AccessibilityIssue): boolean {
  return issue.severity === "critical" || issue.severity === "high";
}
