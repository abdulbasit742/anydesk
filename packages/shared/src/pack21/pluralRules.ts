export function formatCountLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function simplePluralCategory(count: number): "one" | "other" {
  return count === 1 ? "one" : "other";
}
