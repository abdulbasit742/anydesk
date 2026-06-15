import { z } from 'zod';

export const EnrollmentAuditEventType = z.enum([
  'token_created',
  'token_used',
  'token_expired',
  'token_revoked',
  'device_enrollment_requested',
  'device_approved',
  'device_rejected',
  'enrollment_policy_updated',
]);

export const EnrollmentAuditEventSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the audit event.'),
  organizationId: z.string().uuid().describe('ID of the organization the event belongs to.'),
  eventType: EnrollmentAuditEventType.describe('Type of enrollment audit event.'),
  timestamp: z.string().datetime().describe('Timestamp when the event occurred.'),
  actorId: z.string().uuid().optional().describe('ID of the user or system that initiated the event.'),
  actorType: z.enum(['user', 'system']).optional().describe('Type of actor who initiated the event.'),
  targetId: z.string().uuid().optional().describe('ID of the resource affected by the event (e.g., token ID, device ID).'),
  targetType: z.enum(['enrollment_token', 'device', 'enrollment_policy']).optional().describe('Type of resource affected by the event.'),
  details: z.record(z.any()).optional().describe('Additional details relevant to the event.'),
  ipAddress: z.string().ip().optional().describe('IP address from which the event was initiated.'),
});

export type EnrollmentAuditEvent = z.infer<typeof EnrollmentAuditEventSchema>;

export const CreateEnrollmentAuditEventSchema = EnrollmentAuditEventSchema.omit({ id: true, timestamp: true });
export type CreateEnrollmentAuditEvent = z.infer<typeof CreateEnrollmentAuditEventSchema>;
