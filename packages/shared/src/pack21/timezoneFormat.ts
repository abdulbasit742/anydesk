export interface TimezoneFormatInput {
  iso: string;
  locale: string;
  timeZone: string;
}

export function formatLocalDateTime(input: TimezoneFormatInput): string {
  return new Intl.DateTimeFormat(input.locale, { dateStyle: "medium", timeStyle: "short", timeZone: input.timeZone }).format(new Date(input.iso));
}
