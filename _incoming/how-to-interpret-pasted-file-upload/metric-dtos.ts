import { z } from 'zod';

export const MetricType = z.enum([
  'counter',
  'gauge',
  'histogram',
  'summary',
]);

export const MetricSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the metric record.'),
  timestamp: z.string().datetime().describe('Timestamp when the metric was recorded.'),
  name: z.string().min(1).describe('Name of the metric (e.g., cpu_usage_percent, active_sessions_count).'),
  type: MetricType.describe('Type of the metric.'),
  value: z.number().describe('The measured value of the metric.'),
  service: z.string().min(1).describe('Name of the service or application generating the metric.'),
  organizationId: z.string().uuid().optional().describe('ID of the organization related to the metric.'),
  deviceId: z.string().uuid().optional().describe('ID of the device related to the metric.'),
  labels: z.record(z.string()).optional().describe('Key-value pairs for metric labels (e.g., { region: "us-east-1", host: "server-1" }).'),
  unit: z.string().optional().describe('Unit of the metric (e.g., percent, count, ms, bytes).'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the metric record was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the metric record was last updated.'),
});

export type Metric = z.infer<typeof MetricSchema>;

export const CreateMetricSchema = MetricSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateMetric = z.infer<typeof CreateMetricSchema>;
