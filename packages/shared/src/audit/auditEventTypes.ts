export type AuditActorType = 'user' | 'system' | 'service-account';
export type AuditSeverity = 'info' | 'warning' | 'critical';

export type AuditEventType =
  | 'session.created'
  | 'session.connected'
  | 'session.disconnected'
  | 'file_transfer.offered'
  | 'file_transfer.accepted'
  | 'file_transfer.rejected'
  | 'file_transfer.completed'
  | 'file_transfer.failed'
  | 'clipboard.enabled'
  | 'clipboard.disabled'
  | 'clipboard.synced'
  | 'remote_input.enabled'
  | 'remote_input.disabled'
  | 'remote_input.blocked'
  | 'billing.limit_enforced'
  | 'team.invite.created'
  | 'support.ticket.created'
  | 'security.trusted_device_added'
  | 'security.suspicious_activity';

export type AuditActor = {
  readonly type: AuditActorType;
  readonly id: string;
  readonly email?: string;
};

export type AuditEvent<TMetadata extends Record<string, unknown> = Record<string, unknown>> = {
  readonly id: string;
  readonly type: AuditEventType;
  readonly actor: AuditActor;
  readonly organizationId: string;
  readonly sessionId?: string;
  readonly deviceId?: string;
  readonly severity: AuditSeverity;
  readonly metadata: TMetadata;
  readonly occurredAtMs: number;
};
