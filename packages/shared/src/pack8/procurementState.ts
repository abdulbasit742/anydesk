export type ProcurementState = "requested" | "security_review" | "legal_review" | "approved" | "rejected" | "cancelled";
export function canTransitionProcurementState(from: ProcurementState, to: ProcurementState): boolean {
  const allowed: Record<ProcurementState, ProcurementState[]> = { requested:["security_review","cancelled"], security_review:["legal_review","rejected","cancelled"], legal_review:["approved","rejected","cancelled"], approved:[], rejected:[], cancelled:[] };
  return allowed[from].includes(to);
}
