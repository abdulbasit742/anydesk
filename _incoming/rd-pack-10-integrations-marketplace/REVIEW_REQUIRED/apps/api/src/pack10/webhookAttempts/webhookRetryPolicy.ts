export function nextConnectorWebhookRetry(attempts: number, now = Date.now()): number | null {
  if (attempts >= 8) return null;
  return now + Math.min(60 * 60 * 1000, 1000 * 2 ** attempts);
}
