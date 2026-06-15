import { z } from 'zod';

export const SloMetricType = z.enum([
  'latency',
  'availability',
  'throughput',
  'error_rate',
  'duration',
  'freshness',
]);

export const SloObjectiveSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the SLO objective.'),
  name: z.string().min(1).describe('Name of the SLO objective.'),
  description: z.string().optional().describe('Description of the SLO objective.'),
  serviceId: z.string().uuid().describe('ID of the service this SLO applies to.'),
  metricType: SloMetricType.describe('Type of metric being measured for the SLO.'),
  targetPercentage: z.number().min(0).max(100).describe('Target percentage for the SLO (e.g., 99.9% availability).'),
  timeWindowSeconds: z.number().int().min(60).describe('Time window in seconds over which the SLO is measured.'),
  goodEventFilter: z.string().min(1).describe('Filter to define what constitutes a 
good event (e.g., HTTP 2xx, latency < 100ms).
  badEventFilter: z.string().min(1).describe("Filter to define what constitutes a bad event (e.g., HTTP 5xx, latency > 1s)."),
  alertThreshold: z.number().min(0).max(100).optional().describe("Percentage of error budget consumed before an alert is triggered."),
  errorBudgetBurnRateThreshold: z.number().min(0).optional().describe("Rate at which error budget is consumed before an alert is triggered."),
  createdAt: z.string().datetime().optional().describe("Timestamp when the SLO objective was created."),
  updatedAt: z.string().datetime().optional().describe("Timestamp when the SLO objective was last updated."),
});

export type SloObjective = z.infer<typeof SloObjectiveSchema>;

export const CreateSloObjectiveSchema = SloObjectiveSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateSloObjective = z.infer<typeof CreateSloObjectiveSchema>;

export const UpdateSloObjectiveSchema = SloObjectiveSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateSloObjective = z.infer<typeof UpdateSloObjectiveSchema>;

export const ErrorBudgetStatusSchema = z.object({
  sloObjectiveId: z.string().uuid().describe("ID of the associated SLO objective."),
  currentBudgetRemaining: z.number().min(0).max(100).describe("Current percentage of error budget remaining."),
  burnRate: z.number().describe("Current rate at which the error budget is being consumed."),
  timeToExhaustionSeconds: z.number().int().optional().describe("Estimated time in seconds until the error budget is exhausted."),
  status: z.enum(["healthy", "warning", "critical", "exhausted"]).describe("Overall status of the error budget."),
  lastEvaluatedAt: z.string().datetime().describe("Timestamp when the error budget was last evaluated."),
});

export type ErrorBudgetStatus = z.infer<typeof ErrorBudgetStatusSchema>;
