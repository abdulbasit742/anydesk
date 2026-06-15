import { z } from 'zod';

export const TriageRuleConditionType = z.enum([
  'keyword_match',
  'metric_threshold',
  'log_pattern',
  'anomaly_detection',
]);

export const TriageRuleActionType = z.enum([
  'assign_team',
  'escalate_severity',
  'notify_channel',
  'trigger_playbook',
  'create_ticket',
]);

export const TriageRuleConditionSchema = z.object({
  type: TriageRuleConditionType.describe('Type of condition to evaluate.'),
  value: z.string().min(1).describe('Value associated with the condition (e.g., keyword, regex, metric name).'),
  threshold: z.number().optional().describe('Threshold for metric_threshold conditions.'),
  operator: z.enum(['eq', 'ne', 'gt', 'lt', 'ge', 'le', 'contains', 'not_contains']).optional().describe('Operator for condition evaluation.'),
});

export const TriageRuleActionSchema = z.object({
  type: TriageRuleActionType.describe('Type of action to perform.'),
  target: z.string().min(1).describe('Target for the action (e.g., team ID, channel name, playbook ID, ticket type).'),
  message: z.string().optional().describe('Custom message to include with the action.'),
});

export const AiTriageRuleSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the AI triage rule.'),
  name: z.string().min(1).describe('Name of the triage rule.'),
  description: z.string().optional().describe('Description of the rule.'),
  isEnabled: z.boolean().default(true).describe('Whether the rule is active.'),
  priority: z.number().int().min(1).max(100).default(50).describe('Priority of the rule (lower number = higher priority).'),
  conditions: z.array(TriageRuleConditionSchema).min(1).describe('List of conditions that must be met for the rule to trigger.'),
  actions: z.array(TriageRuleActionSchema).min(1).describe('List of actions to perform when the rule triggers.'),
  createdBy: z.string().uuid().optional().describe('ID of the user who created the rule.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the rule was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the rule was last updated.'),
});

export type AiTriageRule = z.infer<typeof AiTriageRuleSchema>;

export const CreateAiTriageRuleSchema = AiTriageRuleSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateAiTriageRule = z.infer<typeof CreateAiTriageRuleSchema>;

export const UpdateAiTriageRuleSchema = AiTriageRuleSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateAiTriageRule = z.infer<typeof UpdateAiTriageRuleSchema>;
