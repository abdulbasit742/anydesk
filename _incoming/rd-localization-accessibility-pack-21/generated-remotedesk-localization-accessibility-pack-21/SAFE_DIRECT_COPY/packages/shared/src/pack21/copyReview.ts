export type CopyReviewState = "draft" | "reviewed" | "approved" | "rejected";

export function copyCanPublish(state: CopyReviewState): boolean {
  return state === "approved";
}
