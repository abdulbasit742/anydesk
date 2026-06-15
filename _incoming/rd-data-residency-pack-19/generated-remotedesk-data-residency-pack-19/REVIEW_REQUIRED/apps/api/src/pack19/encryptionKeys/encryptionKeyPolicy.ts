export function encryptionKeyCanRetire(input: { status: string; replacementKeyActive: boolean }): boolean {
  return input.status === "active" && input.replacementKeyActive;
}
