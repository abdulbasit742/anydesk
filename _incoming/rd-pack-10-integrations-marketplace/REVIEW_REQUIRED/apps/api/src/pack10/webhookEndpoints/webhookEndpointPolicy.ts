export function validateWebhookEndpoint(url: string): string[] {
  const errors: string[] = [];
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") errors.push("https-required");
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") errors.push("local-url-blocked");
  } catch {
    errors.push("invalid-url");
  }
  return errors;
}
