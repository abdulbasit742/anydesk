export interface ReportDateRange {
  startsAt: string;
  endsAt: string;
}

export function validateReportDateRange(range: ReportDateRange): string[] {
  const errors: string[] = [];
  const starts = new Date(range.startsAt).getTime();
  const ends = new Date(range.endsAt).getTime();
  if (!Number.isFinite(starts) || !Number.isFinite(ends)) errors.push("invalid-date");
  if (starts >= ends) errors.push("start-after-end");
  if (ends - starts > 366 * 24 * 60 * 60 * 1000) errors.push("range-too-large");
  return errors;
}
