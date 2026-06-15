export function pushTokenCanSend(input: { revokedAt?: string; userNotificationsEnabled: boolean }): boolean { return !input.revokedAt && input.userNotificationsEnabled; }
