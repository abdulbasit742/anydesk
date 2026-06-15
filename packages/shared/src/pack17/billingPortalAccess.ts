export type BillingPortalRole = "owner" | "admin" | "billing" | "auditor" | "member" | "viewer";

export function canOpenBillingPortal(role: BillingPortalRole): boolean {
  return ["owner", "admin", "billing", "auditor"].includes(role);
}

export function canModifyBillingPortal(role: BillingPortalRole): boolean {
  return ["owner", "admin", "billing"].includes(role);
}
