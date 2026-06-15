import { z } from 'zod';

export const ResourceType = z.enum([
  'cpu',
  'memory',
  'network_io',
  'disk_io',
  'database_connections',
  'api_requests_per_second',
]);

export const ScalingDirection = z.enum([
  'scale_up',
  'scale_down',
  'no_change',
]);

export const PredictiveScalingForecastSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the scaling forecast.'),
  timestamp: z.string().datetime().describe('Timestamp for which the forecast is made.'),
  resourceId: z.string().uuid().describe('ID of the resource being forecasted (e.g., server group, service instance).'),
  resourceType: ResourceType.describe('Type of resource being forecasted.'),
  forecastedLoad: z.number().min(0).describe('Predicted load for the resource.'),
  currentLoad: z.number().min(0).optional().describe('Current observed load for the resource.'),
  unit: z.string().min(1).describe('Unit of the forecasted and current load (e.g., %, Mbps, connections).'),
  recommendedAction: ScalingDirection.describe('Recommended scaling action based on the forecast.'),
  confidenceScore: z.number().min(0).max(1).optional().describe('Confidence score of the forecast (0-1).'),
  predictedEvent: z.string().optional().describe('Description of a predicted event driving the forecast (e.g., 
marketing campaign, seasonal peak).
  createdAt: z.string().datetime().optional().describe("Timestamp when the forecast was created."),
  updatedAt: z.string().datetime().optional().describe("Timestamp when the forecast was last updated."),
});

export type PredictiveScalingForecast = z.infer<typeof PredictiveScalingForecastSchema>;

export const CreatePredictiveScalingForecastSchema = PredictiveScalingForecastSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreatePredictiveScalingForecast = z.infer<typeof CreatePredictiveScalingForecastSchema>;

export const UpdatePredictiveScalingForecastSchema = PredictiveScalingForecastSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdatePredictiveScalingForecast = z.infer<typeof UpdatePredictiveScalingForecastSchema>;
