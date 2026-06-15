import { z } from 'zod';

export const ClipboardDlpRuleSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the DLP rule.'),
  organizationId: z.string().uuid().describe('ID of the organization this rule belongs to.'),
  name: z.string().min(1).describe('Name of the DLP rule.'),
  description: z.string().optional().describe('Description of the DLP rule.'),
  enabled: z.boolean().default(true).describe('Whether the rule is enabled.'),
  priority: z.number().int().min(1).max(100).default(50).describe('Priority of the rule (lower number means higher priority).'),
  action: z.enum(['block', 'warn', 'audit']).default('block').describe('Action to take when the rule is triggered.'),
  patterns: z.array(z.string().min(1)).describe('Regular expressions or keywords to match in clipboard content.'),
  excludePatterns: z.array(z.string().min(1)).optional().describe('Regular expressions or keywords to exclude from matching.'),
  sensitivity: z.enum(['low', 'medium', 'high']).default('medium').describe('Sensitivity level of the data this rule protects.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the rule was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the rule was last updated.'),
});

export type ClipboardDlpRule = z.infer<typeof ClipboardDlpRuleSchema>;

export const CreateClipboardDlpRuleSchema = ClipboardDlpRuleSchema.omit({ id: true, organizationId: true, createdAt: true, updatedAt: true });
export type CreateClipboardDlpRule = z.infer<typeof CreateClipboardDlpRuleSchema>;

export const UpdateClipboardDlpRuleSchema = ClipboardDlpRuleSchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateClipboardDlpRule = z.infer<typeof UpdateClipboardDlpRuleSchema>;
