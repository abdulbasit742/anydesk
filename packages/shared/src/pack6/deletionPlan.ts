export interface DeletionPlanStep {
  resource: string;
  action: "delete" | "anonymize" | "retain";
  reason: string;
}

export function summarizeDeletionPlan(steps: readonly DeletionPlanStep[]): Record<DeletionPlanStep["action"], number> {
  return steps.reduce<Record<DeletionPlanStep["action"], number>>(
    (acc, step) => ({ ...acc, [step.action]: acc[step.action] + 1 }),
    { delete: 0, anonymize: 0, retain: 0 }
  );
}

export function hasBlockingRetention(steps: readonly DeletionPlanStep[]): boolean {
  return steps.some((step) => step.action === "retain");
}
