export type ScheduledReportCadence = "daily" | "weekly" | "monthly";

export function nextScheduledReportAt(cadence: ScheduledReportCadence, from = new Date()): Date {
  const next = new Date(from);
  if (cadence === "daily") next.setUTCDate(next.getUTCDate() + 1);
  if (cadence === "weekly") next.setUTCDate(next.getUTCDate() + 7);
  if (cadence === "monthly") next.setUTCMonth(next.getUTCMonth() + 1);
  next.setUTCHours(8, 0, 0, 0);
  return next;
}
