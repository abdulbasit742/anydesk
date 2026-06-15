import type { DataRegion } from "./dataRegion.js";

export interface ResidencyPolicy {
  tenantId: string;
  primaryRegion: DataRegion;
  allowedBackupRegions: DataRegion[];
  crossRegionSupportAccess: boolean;
}

export function regionAllowedByPolicy(policy: ResidencyPolicy, region: DataRegion, purpose: "primary" | "backup" | "support"): boolean {
  if (purpose === "primary") return policy.primaryRegion === region;
  if (purpose === "backup") return policy.allowedBackupRegions.includes(region);
  return policy.crossRegionSupportAccess || policy.primaryRegion === region;
}
