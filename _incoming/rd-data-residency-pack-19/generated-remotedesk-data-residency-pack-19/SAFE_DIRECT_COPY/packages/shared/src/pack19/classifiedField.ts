export type FieldClassification = "public" | "internal" | "confidential" | "restricted";

export function fieldRequiresEncryption(classification: FieldClassification): boolean {
  return classification === "confidential" || classification === "restricted";
}

export function fieldRequiresRedaction(role: string, classification: FieldClassification): boolean {
  if (classification === "public") return false;
  if (classification === "internal") return !["owner", "admin", "support", "auditor"].includes(role);
  if (classification === "confidential") return !["owner", "admin", "auditor"].includes(role);
  return role !== "owner";
}
