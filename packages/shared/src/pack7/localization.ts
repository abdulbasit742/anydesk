export type LocaleCode = "en" | "ur" | "es" | "fr" | "de";

export interface LocalizedMessage {
  key: string;
  values?: Record<string, string | number>;
}

export function formatLocalizedMessage(template: string, values: Record<string, string | number> = {}): string {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_match, key) => String(values[key] ?? ""));
}
