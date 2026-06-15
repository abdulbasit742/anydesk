export type NotificationChannel = "email" | "in_app" | "push" | "webhook";

export interface NotificationPreference {
  channel: NotificationChannel;
  enabled: boolean;
  digestOnly?: boolean;
}

export function channelEnabled(preferences: readonly NotificationPreference[], channel: NotificationChannel): boolean {
  return preferences.some((preference) => preference.channel === channel && preference.enabled);
}
