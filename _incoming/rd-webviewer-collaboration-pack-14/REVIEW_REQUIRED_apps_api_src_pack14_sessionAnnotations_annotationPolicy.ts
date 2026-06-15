export function annotationAllowed(input: { viewerCanAnnotate: boolean; sessionActive: boolean }): { allowed: boolean; reason: string } {
  if (!input.sessionActive) return { allowed: false, reason: "session-not-active" };
  if (!input.viewerCanAnnotate) return { allowed: false, reason: "annotate-permission-required" };
  return { allowed: true, reason: "allowed" };
}
