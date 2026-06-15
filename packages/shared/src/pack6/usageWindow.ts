export type UsageWindowKind = "hour" | "day" | "month";

export interface UsageWindow {
  kind: UsageWindowKind;
  startsAt: string;
  endsAt: string;
}

export function getUsageWindow(kind: UsageWindowKind, now = new Date()): UsageWindow {
  const start = new Date(now);
  if (kind === "hour") {
    start.setUTCMinutes(0, 0, 0);
    return { kind, startsAt: start.toISOString(), endsAt: new Date(start.getTime() + 3600000).toISOString() };
  }
  if (kind === "day") {
    start.setUTCHours(0, 0, 0, 0);
    return { kind, startsAt: start.toISOString(), endsAt: new Date(start.getTime() + 86400000).toISOString() };
  }
  start.setUTCDate(1);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  return { kind, startsAt: start.toISOString(), endsAt: end.toISOString() };
}
