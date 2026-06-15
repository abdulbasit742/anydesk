const SAFE_ACTIONS = new Set(["send_notification", "create_support_ticket", "add_audit_note", "request_approval", "tag_device", "disable_file_transfer", "require_mfa"]);

export function validateAutomationAction(action: string): { ok: true } | { ok: false; reason: string } {
  if (!SAFE_ACTIONS.has(action)) return { ok: false, reason: "unsupported-action" };
  return { ok: true };
}
