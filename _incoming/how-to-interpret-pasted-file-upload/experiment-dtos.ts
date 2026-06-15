import { z } from 'zod';

export const ChaosExperimentStatus = z.enum([
  'draft',
  'scheduled',
  'running',
  'completed',
  'failed',
  'cancelled',
]);

export const ChaosExperimentType = z.enum([
  'resource_exhaustion',
  'network_latency',
  'network_loss',
  'process_kill',
  'service_failure',
  'time_drift',
  'custom_fault',
]);

export const ChaosExperimentScope = z.enum([
  'all_services',
  'specific_services',
  'specific_hosts',
  'specific_regions',
]);

export const ChaosExperimentSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the chaos experiment.'),
  name: z.string().min(1).describe('Name of the chaos experiment.'),
  description: z.string().optional().describe('Description of the experiment.'),
  status: ChaosExperimentStatus.default('draft').describe('Current status of the experiment.'),
  type: ChaosExperimentType.describe('Type of fault to inject.'),
  scope: ChaosExperimentScope.describe('Scope of the experiment.'),
  targetServices: z.array(z.string()).optional().describe('List of service names to target.'),
  targetHosts: z.array(z.string()).optional().describe('List of host identifiers to target.'),
  targetRegions: z.array(z.string()).optional().describe('List of cloud regions to target.'),
  durationSeconds: z.number().int().min(1).describe('Duration of the fault injection in seconds.'),
  scheduledAt: z.string().datetime().optional().describe('Timestamp when the experiment is scheduled to run.'),
  executedAt: z.string().datetime().optional().describe('Timestamp when the experiment actually started.'),
  completedAt: z.string().datetime().optional().describe('Timestamp when the experiment completed.'),
  initiatedBy: z.string().uuid().optional().describe('ID of the user who initiated the experiment.'),
  hypothesis: z.string().min(1).describe('The hypothesis being tested by this experiment.'),
  expectedImpact: z.string().optional().describe('Expected impact on the system if the hypothesis is false.'),
  actualImpact: z.string().optional().describe('Actual observed impact during the experiment.'),
  rollbacksPerformed: z.boolean().default(false).describe('Indicates if rollbacks were performed during the experiment.'),
  findings: z.string().optional().describe('Summary of findings from the experiment.'),
  recommendations: z.string().optional().describe('Recommendations based on the experiment findings.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the experiment was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the experiment was last updated.'),
});

export type ChaosExperiment = z.infer<typeof ChaosExperimentSchema>;

export const CreateChaosExperimentSchema = ChaosExperimentSchema.omit({ id: true, status: true, executedAt: true, completedAt: true, actualImpact: true, rollbacksPerformed: true, findings: true, recommendations: true, createdAt: true, updatedAt: true });
export type CreateChaosExperiment = z.infer<typeof CreateChaosExperimentSchema>;

export const UpdateChaosExperimentSchema = ChaosExperimentSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateChaosExperiment = z.infer<typeof UpdateChaosExperimentSchema>;
