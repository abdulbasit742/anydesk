export function scopesAllowed(requested: readonly string[], allowed: readonly string[]): boolean {
  return requested.every((scope) => allowed.includes(scope));
}
