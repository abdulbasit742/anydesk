import { z } from 'zod';

export const AlertSeverity = z.enum([
  'info',
  'warning',
  'error',
  'critical',
]);

export const AlertStatus = z.enum([
  'firing',
  'resolved',
  'acknowledged',
]);

export const AlertSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the alert.'),
  organizationId: z.string().uuid().describe('ID of the organization this alert belongs to.'),
  name: z.string().min(1).describe('Name of the alert rule that triggered this alert.'),
  severity: AlertSeverity.describe('Severity level of the alert.'),
  status: AlertStatus.describe('Current status of the alert.'),
  message: z.string().min(1).describe('A descriptive message for the alert.'),
  triggeredAt: z.string().datetime().describe('Timestamp when the alert was first triggered.'),
  resolvedAt: z.string().datetime().optional().describe('Timestamp when the alert was resolved.'),
  acknowledgedAt: z.string().datetime().optional().describe('Timestamp when the alert was acknowledged.'),
  source: z.string().min(1).describe('Source system or service that generated the alert.'),
  tags: z.array(z.string()).optional().describe('Tags for categorization (e.g., ["production", "network"]).'),
  metadata: z.record(z.any()).optional().describe('Additional structured data associated with the alert.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the alert record was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the alert record was last updated.'),
});

export type Alert = z.infer<typeof AlertSchema>;

export const CreateAlertSchema = AlertSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateAlert = z.infer<typeof CreateAlertSchema>;

export const UpdateAlertSchema = AlertSchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateAlert = z.infer<typeof UpdateAlertSchema>;
