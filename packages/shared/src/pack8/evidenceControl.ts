export type EvidenceControlArea = "security" | "availability" | "confidentiality" | "privacy" | "processing_integrity";
export interface EvidenceControl { id: string; area: EvidenceControlArea; title: string; owner: string; cadenceDays: number; lastCollectedAt?: string; }
export function isEvidenceDue(control: EvidenceControl, now = new Date()): boolean {
  if (!control.lastCollectedAt) return true;
  return now.getTime() - new Date(control.lastCollectedAt).getTime() >= control.cadenceDays * 24 * 60 * 60 * 1000;
}
