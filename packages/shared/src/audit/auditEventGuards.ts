import type { AuditEvent, AuditEventType } from './auditEventTypes.js';

export function isAuditEventType(value: string): value is AuditEventType {
  return [
    'session.created','session.connected','session.disconnected','file_transfer.offered','file_transfer.accepted','file_transfer.rejected',
    'file_transfer.completed','file_transfer.failed','clipboard.enabled','clipboard.disabled','clipboard.synced','remote_input.enabled',
    'remote_input.disabled','remote_input.blocked','billing.limit_enforced','team.invite.created','support.ticket.created',
    'security.trusted_device_added','security.suspicious_activity',
  ].includes(value);
}

export function isAuditEvent(value: unknown): value is AuditEvent {
  if (!value || typeof value !== 'object') return false;
  const maybe = value as Partial<AuditEvent>;
  return typeof maybe.id === 'string' && typeof maybe.organizationId === 'string' && typeof maybe.type === 'string' && isAuditEventType(maybe.type);
}
