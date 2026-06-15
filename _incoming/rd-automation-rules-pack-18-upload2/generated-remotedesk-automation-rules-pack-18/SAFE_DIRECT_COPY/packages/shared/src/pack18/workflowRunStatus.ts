export type WorkflowRunStatus = "queued" | "running" | "completed" | "failed" | "skipped";

export function workflowRunFinished(status: WorkflowRunStatus): boolean {
  return status === "completed" || status === "failed" || status === "skipped";
}
