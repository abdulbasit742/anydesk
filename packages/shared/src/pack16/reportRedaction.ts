export type ReportFieldClass = "public" | "internal" | "confidential" | "restricted";

export function shouldRedactReportField(role: string, fieldClass: ReportFieldClass): boolean {
  if (fieldClass === "public") return false;
  if (fieldClass === "internal") return !["owner", "admin", "auditor", "support"].includes(role);
  if (fieldClass === "confidential") return !["owner", "admin", "auditor"].includes(role);
  return role !== "owner";
}
