export function copyReviewCanPublish(input: { state: string; containsSecret: boolean; containsHtmlScript: boolean }): boolean {
  return input.state === "approved" && !input.containsSecret && !input.containsHtmlScript;
}
