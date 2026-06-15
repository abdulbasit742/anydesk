export interface DesktopNotificationPreference {
  channel: "email" | "in_app" | "push" | "webhook";
  enabled: boolean;
}

export function enabledDesktopNotificationChannels(items: readonly DesktopNotificationPreference[]): string[] {
  return items.filter((item) => item.enabled).map((item) => item.channel);
}
