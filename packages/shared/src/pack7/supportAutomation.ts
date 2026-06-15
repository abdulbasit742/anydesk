export interface SupportAutomationInput {
  ticketPriority: "low" | "normal" | "high" | "urgent";
  hasDiagnosticsBundle: boolean;
  issueType: "billing" | "connection" | "file_transfer" | "clipboard" | "security" | "other";
}

export function recommendSupportAutomation(input: SupportAutomationInput): string[] {
  const steps: string[] = [];
  if (!input.hasDiagnosticsBundle && input.issueType !== "billing") steps.push("request_diagnostics_bundle");
  if (input.issueType === "connection") steps.push("attach_webrtc_troubleshooting_guide");
  if (input.issueType === "file_transfer") steps.push("attach_file_transfer_debugging_guide");
  if (input.ticketPriority === "urgent" || input.issueType === "security") steps.push("page_support_lead");
  return steps;
}
