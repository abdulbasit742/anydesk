export function localizationBundleCanPublish(input: { approvedTranslations: number; totalTranslations: number; issueCount: number }): { allowed: boolean; reason: string } {
  if (input.issueCount > 0) return { allowed: false, reason: "open-issues" };
  if (input.totalTranslations === 0) return { allowed: false, reason: "empty-bundle" };
  if (input.approvedTranslations / input.totalTranslations < 0.95) return { allowed: false, reason: "approval-threshold" };
  return { allowed: true, reason: "allowed" };
}
