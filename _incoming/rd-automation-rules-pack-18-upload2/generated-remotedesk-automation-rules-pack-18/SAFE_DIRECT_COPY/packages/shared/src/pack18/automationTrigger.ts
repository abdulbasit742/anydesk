export type AutomationTrigger =
  | "session.started"
  | "session.ended"
  | "file_transfer.completed"
  | "support.ticket.created"
  | "billing.invoice.past_due"
  | "security.alert.opened"
  | "device.posture.failed";

export function isSupportedAutomationTrigger(value: string): value is AutomationTrigger {
  return [
    "session.started",
    "session.ended",
    "file_transfer.completed",
    "support.ticket.created",
    "billing.invoice.past_due",
    "security.alert.opened",
    "device.posture.failed"
  ].includes(value);
}
