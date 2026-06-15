export interface AccessibilityLabelInput {
  feature: string;
  state?: string;
  shortcut?: string;
}

export function buildAccessibilityLabel(input: AccessibilityLabelInput): string {
  return [input.feature, input.state, input.shortcut ? `Shortcut ${input.shortcut}` : undefined].filter(Boolean).join(", ");
}
