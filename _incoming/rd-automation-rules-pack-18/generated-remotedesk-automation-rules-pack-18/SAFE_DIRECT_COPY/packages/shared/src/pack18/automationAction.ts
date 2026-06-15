export type SafeAutomationAction =
  | "send_notification"
  | "create_support_ticket"
  | "add_audit_note"
  | "request_approval"
  | "tag_device"
  | "disable_file_transfer"
  | "require_mfa";

export function isSafeAutomationAction(value: string): value is SafeAutomationAction {
  return [
    "send_notification",
    "create_support_ticket",
    "add_audit_note",
    "request_approval",
    "tag_device",
    "disable_file_transfer",
    "require_mfa"
  ].includes(value);
}
