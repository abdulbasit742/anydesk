export type SupportSlaPriority = "low" | "normal" | "high" | "urgent";

export function firstResponseDueAt(priority: SupportSlaPriority, createdAt: Date): Date {
  const hours = priority === "urgent" ? 1 : priority === "high" ? 4 : priority === "normal" ? 24 : 72;
  return new Date(createdAt.getTime() + hours * 3600000);
}

export function isSlaBreached(priority: SupportSlaPriority, createdAt: Date, now = new Date()): boolean {
  return now > firstResponseDueAt(priority, createdAt);
}
