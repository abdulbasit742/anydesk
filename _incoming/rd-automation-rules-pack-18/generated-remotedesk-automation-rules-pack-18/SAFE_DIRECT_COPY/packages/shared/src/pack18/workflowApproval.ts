export type WorkflowApprovalState = "pending" | "approved" | "rejected" | "expired";

export function workflowApprovalIsFinal(state: WorkflowApprovalState): boolean {
  return state === "approved" || state === "rejected" || state === "expired";
}

export function workflowApprovalAllowsRun(state: WorkflowApprovalState): boolean {
  return state === "approved";
}
