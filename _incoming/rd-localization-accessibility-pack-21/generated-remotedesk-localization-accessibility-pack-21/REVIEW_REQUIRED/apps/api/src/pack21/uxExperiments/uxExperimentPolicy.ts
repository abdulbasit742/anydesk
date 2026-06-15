export function experimentRolloutAllowed(input: { rolloutPercent: number; enabled: boolean; guardrailPassed: boolean }): { allowed: boolean; reason: string } {
  if (!input.enabled) return { allowed: false, reason: "experiment-disabled" };
  if (!input.guardrailPassed) return { allowed: false, reason: "guardrail-failed" };
  if (input.rolloutPercent < 0 || input.rolloutPercent > 100) return { allowed: false, reason: "invalid-rollout" };
  return { allowed: true, reason: "allowed" };
}
