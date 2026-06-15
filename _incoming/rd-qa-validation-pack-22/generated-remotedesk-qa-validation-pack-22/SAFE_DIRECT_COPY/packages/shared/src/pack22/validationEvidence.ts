export type ValidationEvidenceKind = "screenshot" | "log" | "video" | "trace" | "report";

export function evidenceKindAllowed(kind: string): kind is ValidationEvidenceKind {
  return ["screenshot", "log", "video", "trace", "report"].includes(kind);
}
