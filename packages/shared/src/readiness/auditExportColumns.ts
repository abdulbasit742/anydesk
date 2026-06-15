export const AUDIT_EXPORT_COLUMNS = [
  "occurredAt",
  "teamId",
  "actorUserId",
  "eventType",
  "severity",
  "resourceType",
  "resourceId",
  "ipHash",
  "userAgent"
] as const;

export type AuditExportColumn = typeof AUDIT_EXPORT_COLUMNS[number];

export function isAuditExportColumn(value: string): value is AuditExportColumn {
  return (AUDIT_EXPORT_COLUMNS as readonly string[]).includes(value);
}
