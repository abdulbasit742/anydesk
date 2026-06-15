export function validateAccentColor(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}
