export function quarantineAllowed(input: { failureRate: number; runs: number; expiresAt: string }): { allowed: boolean; reason: string } {
  if (input.runs < 10) return { allowed: false, reason: "not-enough-runs" };
  if (input.failureRate < 0.2) return { allowed: false, reason: "failure-rate-too-low" };
  if (new Date(input.expiresAt) <= new Date()) return { allowed: false, reason: "expiry-in-past" };
  return { allowed: true, reason: "allowed" };
}
