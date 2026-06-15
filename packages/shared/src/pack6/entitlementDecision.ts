export type EntitlementFeature = "remote_session" | "file_transfer" | "clipboard_sync" | "remote_input" | "audit_export" | "team_admin";

export interface EntitlementDecision {
  feature: EntitlementFeature;
  allowed: boolean;
  reason: string;
  limit?: number;
  used?: number;
}

export function allowEntitlement(feature: EntitlementFeature, reason = "allowed"): EntitlementDecision {
  return { feature, allowed: true, reason };
}

export function denyEntitlement(feature: EntitlementFeature, reason: string, limit?: number, used?: number): EntitlementDecision {
  return { feature, allowed: false, reason, limit, used };
}
