export type ApprovalDecision = "pending" | "approved" | "rejected";
export interface AdminApproval { id: string; requestedByUserId: string; approverUserId?: string; decision: ApprovalDecision; reason?: string; }
export function resolveApproval(approval: AdminApproval, approverUserId: string, decision: Exclude<ApprovalDecision, "pending">, reason?: string): AdminApproval {
  if (approval.decision !== "pending") throw new Error("approval-already-final");
  return { ...approval, approverUserId, decision, reason };
}
