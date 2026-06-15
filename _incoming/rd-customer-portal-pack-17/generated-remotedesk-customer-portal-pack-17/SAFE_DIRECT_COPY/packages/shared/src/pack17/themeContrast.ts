export interface ThemeContrastInput {
  foregroundLuma: number;
  backgroundLuma: number;
}

export function contrastRatio(input: ThemeContrastInput): number {
  const lighter = Math.max(input.foregroundLuma, input.backgroundLuma);
  const darker = Math.min(input.foregroundLuma, input.backgroundLuma);
  return (lighter + 0.05) / (darker + 0.05);
}

export function contrastPasses(input: ThemeContrastInput): boolean {
  return contrastRatio(input) >= 4.5;
}
