import type { AuditActor, AuditEvent, AuditEventType, AuditSeverity } from './auditEventTypes.js';

export function buildAuditEvent<TMetadata extends Record<string, unknown>>(input: {
  readonly id: string;
  readonly type: AuditEventType;
  readonly actor: AuditActor;
  readonly organizationId: string;
  readonly sessionId?: string;
  readonly deviceId?: string;
  readonly severity?: AuditSeverity;
  readonly metadata: TMetadata;
  readonly occurredAtMs: number;
}): AuditEvent<TMetadata> {
  return {
    id: input.id,
    type: input.type,
    actor: input.actor,
    organizationId: input.organizationId,
    sessionId: input.sessionId,
    deviceId: input.deviceId,
    severity: input.severity ?? 'info',
    metadata: Object.freeze({ ...input.metadata }) as TMetadata,
    occurredAtMs: input.occurredAtMs,
  };
}

export function systemAuditActor(id = 'remotedesk-system'): AuditActor {
  return { type: 'system', id };
}
