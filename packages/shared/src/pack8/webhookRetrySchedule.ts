export interface WebhookRetryPolicy { baseDelayMs: number; maxDelayMs: number; maxAttempts: number; }
export function nextWebhookRetryAt(policy: WebhookRetryPolicy, attempt: number, now = Date.now()): number | null {
  if (attempt >= policy.maxAttempts) return null;
  return now + Math.min(policy.maxDelayMs, policy.baseDelayMs * 2 ** Math.max(0, attempt));
}
