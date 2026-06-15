import { z } from 'zod';

export const SelfHealingActionType = z.enum([
  'restart_service',
  'reboot_server',
  'scale_up_resource',
  'rollback_deployment',
  'clear_cache',
  'isolate_component',
  'run_script',
  'notify_human',
]);

export const SelfHealingTriggerType = z.enum([
  'metric_threshold',
  'log_pattern',
  'anomaly_detection',
  'incident_alert',
]);

export const SelfHealingActionSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the self-healing action.'),
  name: z.string().min(1).describe('Name of the self-healing action.'),
  description: z.string().optional().describe('Description of the action.'),
  isEnabled: z.boolean().default(true).describe('Whether the action is active.'),
  actionType: SelfHealingActionType.describe('Type of self-healing action to perform.'),
  targetResourceId: z.string().uuid().optional().describe('ID of the resource to apply the action to (e.g., service ID, server ID).'),
  configuration: z.record(z.any()).optional().describe('Action-specific configuration (e.g., script path, service name).'),
  triggerType: SelfHealingTriggerType.describe('Type of event that triggers this action.'),
  triggerConfig: z.record(z.any()).optional().describe('Trigger-specific configuration (e.g., metric name, threshold, log regex).'),
  cooldownSeconds: z.number().int().min(0).default(300).describe('Cooldown period in seconds before the same action can be triggered again.'),
  maxExecutionsPerDay: z.number().int().min(0).default(5).describe('Maximum number of times this action can be executed per day.'),
  initiatedBy: z.string().uuid().optional().describe('ID of the user or system that created the action.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the action was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the action was last updated.'),
});

export type SelfHealingAction = z.infer<typeof SelfHealingActionSchema>;

export const CreateSelfHealingActionSchema = SelfHealingActionSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateSelfHealingAction = z.infer<typeof CreateSelfHealingActionSchema>;

export const UpdateSelfHealingActionSchema = SelfHealingActionSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateSelfHealingAction = z.infer<typeof UpdateSelfHealingActionSchema>;
