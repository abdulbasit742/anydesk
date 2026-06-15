import { z } from 'zod';

export const AutoTriageRuleSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the auto-triage rule.'),
  organizationId: z.string().uuid().describe('ID of the organization this rule belongs to.'),
  name: z.string().min(1).describe('Name of the auto-triage rule.'),
  description: z.string().optional().describe('Description of the auto-triage rule.'),
  enabled: z.boolean().default(true).describe('Whether the rule is enabled.'),
  priority: z.number().int().min(1).max(100).default(50).describe('Priority of the rule (lower number means higher priority).'),
  conditions: z.array(z.object({
    field: z.enum(['subject', 'description', 'tags', 'customer_email', 'device_os', 'error_code']).describe('Field to check.'),
    operator: z.enum(['contains', 'not_contains', 'equals', 'not_equals', 'starts_with', 'ends_with']).describe('Operator for the condition.'),
    value: z.string().min(1).describe('Value to compare against.'),
  })).min(1).describe('Conditions that must be met for the rule to trigger.'),
  actions: z.array(z.object({
    type: z.enum(['assign_agent', 'assign_team', 'set_priority', 'add_tag', 'send_notification', 'run_macro']).describe('Type of action to perform.'),
    value: z.string().min(1).optional().describe('Value for the action (e.g., agent ID, priority level, tag name, macro ID).'),
  })).min(1).describe('Actions to perform when the rule is triggered.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the rule was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the rule was last updated.'),
});

export type AutoTriageRule = z.infer<typeof AutoTriageRuleSchema>;

export const CreateAutoTriageRuleSchema = AutoTriageRuleSchema.omit({ id: true, organizationId: true, createdAt: true, updatedAt: true });
export type CreateAutoTriageRule = z.infer<typeof CreateAutoTriageRuleSchema>;

export const UpdateAutoTriageRuleSchema = AutoTriageRuleSchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateAutoTriageRule = z.infer<typeof UpdateAutoTriageRuleSchema>;
