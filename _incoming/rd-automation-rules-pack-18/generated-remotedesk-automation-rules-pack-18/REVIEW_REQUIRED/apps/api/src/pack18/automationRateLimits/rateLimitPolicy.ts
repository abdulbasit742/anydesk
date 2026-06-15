export function automationRateLimitExceeded(input: { perMinute: number; usedThisMinute: number; enabled: boolean }): boolean {
  if (!input.enabled) return false;
  return input.usedThisMinute >= input.perMinute;
}
