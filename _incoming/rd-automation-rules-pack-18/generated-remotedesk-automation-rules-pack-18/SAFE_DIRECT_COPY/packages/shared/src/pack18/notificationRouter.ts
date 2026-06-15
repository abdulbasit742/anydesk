export type NotificationTarget = "owner" | "admin" | "support" | "billing" | "security";

export function routeAutomationNotification(eventType: string): NotificationTarget[] {
  if (eventType.startsWith("security.")) return ["owner", "admin", "security"];
  if (eventType.startsWith("billing.")) return ["owner", "admin", "billing"];
  if (eventType.startsWith("support.")) return ["support"];
  return ["admin"];
}
