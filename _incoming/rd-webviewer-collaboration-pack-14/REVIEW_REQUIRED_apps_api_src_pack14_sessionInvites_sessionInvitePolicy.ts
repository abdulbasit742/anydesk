export function validateSessionInvite(input: { expiresAt: string; maxUses: number }): string[] {
  const errors: string[] = [];
  if (new Date(input.expiresAt) <= new Date()) errors.push("expiry-in-past");
  if (input.maxUses < 1 || input.maxUses > 25) errors.push("invalid-max-uses");
  return errors;
}
