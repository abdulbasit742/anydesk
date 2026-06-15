import type { DesktopSessionContext } from './desktopPart2.js';

export type DesktopAuditCategory =
  | 'session'
  | 'file_transfer'
  | 'clipboard'
  | 'remote_input'
  | 'security'
  | 'diagnostics';

export type DesktopAuditSeverity = 'debug' | 'info' | 'warning' | 'error' | 'critical';

export interface DesktopAuditEvent {
  id: string;
  type: string;
  category: DesktopAuditCategory;
  severity: DesktopAuditSeverity;
  occurredAt: string;
  sessionId?: string;
  deviceId?: string;
  actorRole?: DesktopSessionContext['role'];
  targetDeviceId?: string;
  metadata: Record<string, string | number | boolean | null>;
}

export interface DesktopAuditTransport {
  emitAudit(event: DesktopAuditEvent): Promise<void>;
}

export interface DesktopAuditBuilderInput {
  type: string;
  category: DesktopAuditCategory;
  severity?: DesktopAuditSeverity;
  context?: DesktopSessionContext;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}

export function createAuditId(prefix = 'daudit'): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${random}`;
}

export function sanitizeAuditMetadata(
  metadata: Record<string, string | number | boolean | null | undefined> = {},
): DesktopAuditEvent['metadata'] {
  const sanitized: DesktopAuditEvent['metadata'] = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (value === undefined) continue;
    const lower = key.toLowerCase();
    if (lower.includes('password') || lower.includes('secret') || lower.includes('token') || lower.includes('clipboardcontent')) {
      sanitized[key] = '[redacted]';
      continue;
    }
    sanitized[key] = value;
  }
  return sanitized;
}

export function buildDesktopAuditEvent(input: DesktopAuditBuilderInput): DesktopAuditEvent {
  return {
    id: createAuditId(),
    type: input.type,
    category: input.category,
    severity: input.severity ?? 'info',
    occurredAt: new Date().toISOString(),
    sessionId: input.context?.sessionId,
    deviceId: input.context?.deviceId,
    actorRole: input.context?.role,
    targetDeviceId: input.context?.peerDeviceId,
    metadata: sanitizeAuditMetadata(input.metadata),
  };
}
