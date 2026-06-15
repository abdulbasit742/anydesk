export type IncidentSeverity = "sev1" | "sev2" | "sev3" | "sev4";

export interface IncidentImpactInput {
  activeSessionsAffected: number;
  loginBlocked: boolean;
  dataLossSuspected: boolean;
  paidTeamsAffected: number;
}

export function classifyIncidentSeverity(input: IncidentImpactInput): IncidentSeverity {
  if (input.dataLossSuspected || input.loginBlocked || input.activeSessionsAffected >= 100) return "sev1";
  if (input.activeSessionsAffected >= 20 || input.paidTeamsAffected >= 10) return "sev2";
  if (input.activeSessionsAffected > 0 || input.paidTeamsAffected > 0) return "sev3";
  return "sev4";
}
