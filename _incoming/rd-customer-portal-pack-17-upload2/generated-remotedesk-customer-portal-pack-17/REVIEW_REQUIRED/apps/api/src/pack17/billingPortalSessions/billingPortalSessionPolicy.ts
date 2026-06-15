export function billingPortalSessionValid(input: { expiresAt: string; teamActive: boolean }): boolean {
  return input.teamActive && new Date(input.expiresAt) > new Date();
}
