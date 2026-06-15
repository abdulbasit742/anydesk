import { z } from 'zod';

export const IncidentSeverity = z.enum([
  'low',
  'medium',
  'high',
  'critical',
]);

export const IncidentStatus = z.enum([
  'open',
  'in_progress',
  'resolved',
  'closed',
]);

export const IncidentReportSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the incident report.'),
  organizationId: z.string().uuid().describe('ID of the organization this incident belongs to.'),
  title: z.string().min(1).describe('Concise title of the incident.'),
  description: z.string().min(1).describe('Detailed description of the incident.'),
  severity: IncidentSeverity.describe('Severity level of the incident.'),
  status: IncidentStatus.describe('Current status of the incident.'),
  detectedAt: z.string().datetime().describe('Timestamp when the incident was first detected.'),
  startedAt: z.string().datetime().optional().describe('Timestamp when the incident is estimated to have started.'),
  resolvedAt: z.string().datetime().optional().describe('Timestamp when the incident was resolved.'),
  closedAt: z.string().datetime().optional().describe('Timestamp when the incident report was closed.'),
  impact: z.string().optional().describe('Description of the impact on users, systems, or data.'),
  affectedComponents: z.array(z.string()).optional().describe('List of affected system components.'),
  rootCause: z.string().optional().describe('Identified root cause of the incident.'),
  actionsTaken: z.array(z.string()).optional().describe('List of actions taken to mitigate and resolve the incident.'),
  lessonsLearned: z.string().optional().describe('Key lessons learned from the incident.'),
  createdBy: z.string().uuid().optional().describe('ID of the user who created the report.'),
  assignedTo: z.string().uuid().optional().describe('ID of the user or team assigned to the incident.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the report was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the report was last updated.'),
});

export type IncidentReport = z.infer<typeof IncidentReportSchema>;

export const CreateIncidentReportSchema = IncidentReportSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateIncidentReport = z.infer<typeof CreateIncidentReportSchema>;

export const UpdateIncidentReportSchema = IncidentReportSchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateIncidentReport = z.infer<typeof UpdateIncidentReportSchema>;
