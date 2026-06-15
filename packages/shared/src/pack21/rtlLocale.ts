export function isRtlLocale(locale: string): boolean {
  return ["ar", "he", "fa", "ur"].some((rtl) => locale.toLowerCase() === rtl || locale.toLowerCase().startsWith(`${rtl}-`));
}

export function textDirectionForLocale(locale: string): "ltr" | "rtl" {
  return isRtlLocale(locale) ? "rtl" : "ltr";
}
