import { z } from 'zod';

export const AnomalySeverity = z.enum([
  'low',
  'medium',
  'high',
  'critical',
]);

export const AnomalyDetectionEventSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the anomaly detection event.'),
  timestamp: z.string().datetime().describe('Timestamp when the anomaly was detected.'),
  source: z.string().min(1).describe('Origin of the anomaly (e.g., system, network, user behavior).'),
  metricName: z.string().min(1).describe('Name of the metric exhibiting anomalous behavior.'),
  metricValue: z.number().describe('The value of the metric at the time of anomaly.'),
  expectedRange: z.array(z.number()).length(2).optional().describe('Expected range for the metric value.'),
  severity: AnomalySeverity.describe('Severity of the detected anomaly.'),
  description: z.string().optional().describe('Detailed description of the anomaly.'),
  suggestedAction: z.string().optional().describe('Recommended action to address the anomaly.'),
  resourceId: z.string().uuid().optional().describe('ID of the affected resource (e.g., device, server).'),
  correlationId: z.string().uuid().optional().describe('ID for correlating related anomaly events.'),
  isResolved: z.boolean().default(false).describe('Indicates if the anomaly has been resolved.'),
  resolvedBy: z.string().uuid().optional().describe('ID of the user or system that resolved the anomaly.'),
  resolvedAt: z.string().datetime().optional().describe('Timestamp when the anomaly was resolved.'),
});

export type AnomalyDetectionEvent = z.infer<typeof AnomalyDetectionEventSchema>;

export const CreateAnomalyDetectionEventSchema = AnomalyDetectionEventSchema.omit({ id: true, isResolved: true, resolvedBy: true, resolvedAt: true });
export type CreateAnomalyDetectionEvent = z.infer<typeof CreateAnomalyDetectionEventSchema>;

export const UpdateAnomalyDetectionEventSchema = AnomalyDetectionEventSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateAnomalyDetectionEvent = z.infer<typeof UpdateAnomalyDetectionEventSchema>;
