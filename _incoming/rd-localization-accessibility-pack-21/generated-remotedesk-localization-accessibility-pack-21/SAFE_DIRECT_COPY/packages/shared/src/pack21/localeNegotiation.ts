export type SupportedLocale = "en" | "es" | "fr" | "de" | "pt" | "ar" | "ur" | "ja" | "ko" | "zh";

export function normalizeLocale(value: string): string {
  return value.trim().toLowerCase().replace("_", "-");
}

export function chooseSupportedLocale(requested: readonly string[], supported: readonly SupportedLocale[], fallback: SupportedLocale = "en"): SupportedLocale {
  for (const raw of requested) {
    const normalized = normalizeLocale(raw);
    const exact = supported.find((locale) => normalized === locale);
    if (exact) return exact;
    const base = supported.find((locale) => normalized.startsWith(`${locale}-`));
    if (base) return base;
  }
  return fallback;
}
