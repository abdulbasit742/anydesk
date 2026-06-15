export interface SupportHandoffInput {
  sessionActive: boolean;
  hostApproved: boolean;
  supportUserVerified: boolean;
}

export function canStartSupportHandoff(input: SupportHandoffInput): { ok: true } | { ok: false; blockers: string[] } {
  const blockers: string[] = [];
  if (!input.sessionActive) blockers.push("session-not-active");
  if (!input.hostApproved) blockers.push("host-approval-required");
  if (!input.supportUserVerified) blockers.push("support-user-not-verified");
  return blockers.length === 0 ? { ok: true } : { ok: false, blockers };
}
