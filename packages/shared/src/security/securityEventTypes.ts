export type SecurityEventType =
  | 'login.succeeded'
  | 'login.failed'
  | 'trusted_device.added'
  | 'trusted_device.revoked'
  | 'session.remote_input_enabled'
  | 'session.remote_input_blocked'
  | 'suspicious_activity.detected';

export type SecurityEvent = {
  readonly id: string;
  readonly organizationId: string;
  readonly userId?: string;
  readonly deviceId?: string;
  readonly sessionId?: string;
  readonly type: SecurityEventType;
  readonly ipAddress?: string;
  readonly userAgent?: string;
  readonly metadata: Record<string, unknown>;
  readonly occurredAtMs: number;
};
