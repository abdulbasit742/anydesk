export interface ReviewCycle { id: string; orgId: string; type: "user" | "admin" | "device" | "partner"; frequency: "monthly" | "quarterly" | "annual"; nextReview: Date; owner: string; status: "scheduled" | "in_progress" | "completed" | "overdue"; }
export function getNextReviewDate(cycle: ReviewCycle): Date {
  const d = new Date(cycle.nextReview);
  switch (cycle.frequency) { case "monthly": d.setMonth(d.getMonth() + 1); break; case "quarterly": d.setMonth(d.getMonth() + 3); break; case "annual": d.setFullYear(d.getFullYear() + 1); break; }
  return d;
}
export function isOverdue(cycle: ReviewCycle): boolean { return new Date() > cycle.nextReview && cycle.status !== "completed"; }
