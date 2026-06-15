export function transferRequestAllowed(input: { sourceRegion: string; targetRegion: string; purpose: string; approved: boolean }): { allowed: boolean; reason: string } {
  if (input.sourceRegion === input.targetRegion) return { allowed: true, reason: "same-region" };
  if (!input.approved) return { allowed: false, reason: "approval-required" };
  if (input.purpose === "support") return { allowed: false, reason: "support-cross-region-blocked" };
  return { allowed: true, reason: "approved" };
}
