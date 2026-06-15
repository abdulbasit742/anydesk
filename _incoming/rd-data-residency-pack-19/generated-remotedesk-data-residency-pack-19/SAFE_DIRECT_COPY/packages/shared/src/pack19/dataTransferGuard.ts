export interface DataTransferRequest {
  sourceRegion: string;
  targetRegion: string;
  purpose: "backup" | "support" | "migration" | "export";
  approved: boolean;
}

export function crossRegionTransferAllowed(request: DataTransferRequest): { allowed: boolean; reason: string } {
  if (request.sourceRegion === request.targetRegion) return { allowed: true, reason: "same-region" };
  if (!request.approved) return { allowed: false, reason: "approval-required" };
  if (request.purpose === "support") return { allowed: false, reason: "support-cross-region-blocked" };
  return { allowed: true, reason: "approved" };
}
