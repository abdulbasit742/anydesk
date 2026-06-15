import { z } from 'zod';

export const ReleaseStage = z.enum([
  'development',
  'testing',
  'staging',
  'production',
  'rollback',
]);

export const ReleaseStatus = z.enum([
  'pending',
  'in_progress',
  'completed',
  'failed',
  'cancelled',
  'paused',
]);

export const ReleaseStepType = z.enum([
  'build_artifact',
  'run_tests',
  'deploy_service',
  'run_migrations',
  'notify_team',
  'manual_approval',
  'health_check',
  'rollback_service',
]);

export const ReleaseStepSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the release step.'),
  name: z.string().min(1).describe('Name of the release step.'),
  type: ReleaseStepType.describe('Type of action for this release step.'),
  status: ReleaseStatus.default('pending').describe('Current status of the release step.'),
  order: z.number().int().min(1).describe('Order of execution within its stage.'),
  configuration: z.record(z.any()).optional().describe('Step-specific configuration (e.g., service name, test suite).'),
  dependsOn: z.array(z.string().uuid()).optional().describe('List of step IDs this step depends on.'),
  startedAt: z.string().datetime().optional().describe('Timestamp when the step started.'),
  completedAt: z.string().datetime().optional().describe('Timestamp when the step completed.'),
  errorMessage: z.string().optional().describe('Error message if the step failed.'),
});

export type ReleaseStep = z.infer<typeof ReleaseStepSchema>;

export const ReleasePipelineSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the release pipeline.'),
  name: z.string().min(1).describe('Name of the release pipeline.'),
  description: z.string().optional().describe('Description of the release pipeline.'),
  version: z.string().min(1).describe('Version of the application being released.'),
  status: ReleaseStatus.default('pending').describe('Overall status of the release pipeline.'),
  currentStage: ReleaseStage.optional().describe('Current stage of the release pipeline.'),
  stages: z.record(ReleaseStage, z.array(ReleaseStepSchema)).describe('Steps organized by release stage.'),
  initiatedBy: z.string().uuid().optional().describe('ID of the user who initiated the release.'),
  startedAt: z.string().datetime().optional().describe('Timestamp when the release pipeline started.'),
  completedAt: z.string().datetime().optional().describe('Timestamp when the release pipeline completed.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the pipeline was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the pipeline was last updated.'),
});

export type ReleasePipeline = z.infer<typeof ReleasePipelineSchema>;

export const CreateReleasePipelineSchema = ReleasePipelineSchema.omit({ id: true, status: true, currentStage: true, startedAt: true, completedAt: true, createdAt: true, updatedAt: true });
export type CreateReleasePipeline = z.infer<typeof CreateReleasePipelineSchema>;

export const UpdateReleasePipelineSchema = ReleasePipelineSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateReleasePipeline = z.infer<typeof UpdateReleasePipelineSchema>;

// New DTOs for Release Orchestration

export const DeploymentStrategy = z.enum([
  'BLUE_GREEN',
  'CANARY',
  'ROLLING_UPDATE',
  'ALL_AT_ONCE',
  'MANUAL',
]);

export const ReleaseApprovalSchema = z.object({
  approverId: z.string().uuid().describe('ID of the user who approved the release.'),
  approvalTimestamp: z.string().datetime().describe('Timestamp when the approval was given.'),
  comments: z.string().optional().describe('Optional comments from the approver.'),
  isApproved: z.boolean().describe('Whether the release was approved.'),
});

export type ReleaseApproval = z.infer<typeof ReleaseApprovalSchema>;

export const ReleaseOrchestrationStepSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the orchestration step.'),
  name: z.string().min(1).describe('Name of the orchestration step (e.g., Deploy to Staging, Run E2E Tests).'),
  description: z.string().optional().describe('Description of the step.'),
  status: ReleaseStatus.describe('Current status of the orchestration step.'),
  startTime: z.string().datetime().optional().describe('Timestamp when the step started.'),
  endTime: z.string().datetime().optional().describe('Timestamp when the step ended.'),
  logsUrl: z.string().url().optional().describe('URL to the logs for this step.'),
  requiredApprovals: z.array(ReleaseApprovalSchema).optional().describe('List of approvals required for this step.'),
  isManual: z.boolean().default(false).describe('Whether this step requires manual intervention.'),
});

export type ReleaseOrchestrationStep = z.infer<typeof ReleaseOrchestrationStepSchema>;

export const ReleaseOrchestrationSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the release orchestration instance.'),
  releaseName: z.string().min(1).describe('Name of the release (e.g., v1.2.0, Hotfix-2023-03-15).'),
  description: z.string().optional().describe('Description of the release.'),
  targetServiceId: z.string().uuid().describe('ID of the service being released.'),
  currentStage: ReleaseStage.describe('Current stage of the release orchestration.'),
  status: ReleaseStatus.describe('Overall status of the release orchestration.'),
  deploymentStrategy: DeploymentStrategy.describe('Strategy used for deploying this release.'),
  pipelineSteps: z.array(ReleaseOrchestrationStepSchema).describe('Ordered list of steps in the release orchestration pipeline.'),
  initiatedBy: z.string().uuid().optional().describe('ID of the user or system that initiated the release.'),
  releaseNotesUrl: z.string().url().optional().describe('URL to the release notes.'),
  rollbackPlanUrl: z.string().url().optional().describe('URL to the rollback plan for this release.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the release orchestration was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the release orchestration was last updated.'),
});

export type ReleaseOrchestration = z.infer<typeof ReleaseOrchestrationSchema>;

export const CreateReleaseOrchestrationSchema = ReleaseOrchestrationSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateReleaseOrchestration = z.infer<typeof CreateReleaseOrchestrationSchema>;

export const UpdateReleaseOrchestrationSchema = ReleaseOrchestrationSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateReleaseOrchestration = z.infer<typeof UpdateReleaseOrchestrationSchema>;
