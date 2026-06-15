export interface LegalHold { id: string; subjectId: string; reason: string; startsAt: string; endsAt?: string; }
export function isLegalHoldActive(hold: LegalHold, now = new Date()): boolean {
  const starts = new Date(hold.startsAt);
  const ends = hold.endsAt ? new Date(hold.endsAt) : undefined;
  return starts <= now && (!ends || now < ends);
}
