export function testRunCanStart(input: { suiteEnabled: boolean; releaseBlocked: boolean; maxParallelReached: boolean }): { allowed: boolean; reason: string } {
  if (!input.suiteEnabled) return { allowed: false, reason: "suite-disabled" };
  if (input.releaseBlocked) return { allowed: false, reason: "release-blocked" };
  if (input.maxParallelReached) return { allowed: false, reason: "parallel-limit" };
  return { allowed: true, reason: "allowed" };
}
