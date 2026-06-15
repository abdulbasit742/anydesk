export interface PolicyDecision {
  allowed: boolean;
  code: string;
  reason: string;
  evidence?: Record<string, unknown>;
}

export function allowPolicy(code = "allowed", reason = "Allowed by policy"): PolicyDecision {
  return { allowed: true, code, reason };
}

export function denyPolicy(code: string, reason: string, evidence?: Record<string, unknown>): PolicyDecision {
  return { allowed: false, code, reason, evidence };
}
