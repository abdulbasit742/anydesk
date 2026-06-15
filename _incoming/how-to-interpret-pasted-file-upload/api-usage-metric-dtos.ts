import { z } from 'zod';

export const ApiUsageMetricSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the API usage metric record.'),
  organizationId: z.string().uuid().describe('ID of the organization this metric belongs to.'),
  apiKeyId: z.string().uuid().optional().describe('ID of the API key used for the request.'),
  endpoint: z.string().min(1).describe('The API endpoint accessed (e.g., /api/v1/sessions).'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).describe('HTTP method used.'),
  statusCode: z.number().int().describe('HTTP status code of the response.'),
  requestCount: z.number().int().min(1).describe('Number of requests made.'),
  responseSizeKb: z.number().min(0).optional().describe('Size of the response body in KB.'),
  latencyMs: z.number().min(0).optional().describe('Latency of the API call in milliseconds.'),
  timestamp: z.string().datetime().describe('Timestamp of the API call.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the metric was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the metric was last updated.'),
});

export type ApiUsageMetric = z.infer<typeof ApiUsageMetricSchema>;

export const CreateApiUsageMetricSchema = ApiUsageMetricSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateApiUsageMetric = z.infer<typeof CreateApiUsageMetricSchema>;

export const UpdateApiUsageMetricSchema = ApiUsageMetricSchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateApiUsageMetric = z.infer<typeof UpdateApiUsageMetricSchema>;
