import { z } from 'zod';

export const DlpAuditEventType = z.enum([
  'clipboard_dlp_blocked',
  'clipboard_dlp_warned',
  'clipboard_dlp_audited',
  'file_transfer_dlp_blocked',
  'file_transfer_dlp_warned',
  'file_transfer_dlp_audited',
  'sensitive_pattern_detected',
]);

export const DlpAuditEventSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the DLP audit event.'),
  organizationId: z.string().uuid().describe('ID of the organization the event belongs to.'),
  sessionId: z.string().uuid().optional().describe('ID of the remote session during which the event occurred.'),
  eventType: DlpAuditEventType.describe('Type of DLP audit event.'),
  timestamp: z.string().datetime().describe('Timestamp when the event occurred.'),
  actorId: z.string().uuid().describe('ID of the user who initiated the action.'),
  targetDeviceId: z.string().uuid().optional().describe('ID of the device involved in the data transfer.'),
  dlpRuleId: z.string().uuid().optional().describe('ID of the DLP rule that was triggered.'),
  sensitivePatternsDetected: z.array(z.object({
    patternId: z.string().describe('ID of the sensitive pattern detected.'),
    patternName: z.string().describe('Name of the sensitive pattern.'),
    severity: z.enum(['low', 'medium', 'high', 'critical']).describe('Severity of the detected pattern.'),
  })).optional().describe('List of sensitive patterns detected.'),
  dataSnippet: z.string().optional().describe('A redacted snippet of the sensitive data (if allowed by policy).'),
  actionTaken: z.enum(['blocked', 'warned', 'audited']).describe('Action taken by the DLP system.'),
  details: z.record(z.any()).optional().describe('Additional details relevant to the event (e.g., file name, clipboard content hash).'),
  ipAddress: z.string().ip().optional().describe('IP address from which the event was initiated.'),
});

export type DlpAuditEvent = z.infer<typeof DlpAuditEventSchema>;

export const CreateDlpAuditEventSchema = DlpAuditEventSchema.omit({ id: true, timestamp: true });
export type CreateDlpAuditEvent = z.infer<typeof CreateDlpAuditEventSchema>;
