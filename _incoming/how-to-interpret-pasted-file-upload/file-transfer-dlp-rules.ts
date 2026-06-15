import { z } from 'zod';

export const FileTransferDlpRuleSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the DLP rule.'),
  organizationId: z.string().uuid().describe('ID of the organization this rule belongs to.'),
  name: z.string().min(1).describe('Name of the DLP rule.'),
  description: z.string().optional().describe('Description of the DLP rule.'),
  enabled: z.boolean().default(true).describe('Whether the rule is enabled.'),
  priority: z.number().int().min(1).max(100).default(50).describe('Priority of the rule (lower number means higher priority).'),
  action: z.enum(['block', 'warn', 'audit']).default('block').describe('Action to take when the rule is triggered.'),
  fileExtensions: z.array(z.string().min(1)).optional().describe('List of file extensions to match (e.g., ["pdf", "docx"]).'),
  minFileSizeKb: z.number().int().min(0).optional().describe('Minimum file size in KB to trigger the rule.'),
  maxFileSizeKb: z.number().int().min(0).optional().describe('Maximum file size in KB to trigger the rule.'),
  patterns: z.array(z.string().min(1)).optional().describe('Regular expressions or keywords to match in file content (if content inspection is enabled).'),
  excludePatterns: z.array(z.string().min(1)).optional().describe('Regular expressions or keywords to exclude from matching.'),
  sensitivity: z.enum(['low', 'medium', 'high']).default('medium').describe('Sensitivity level of the data this rule protects.'),
  direction: z.enum(['inbound', 'outbound', 'both']).default('both').describe('Direction of file transfer to apply the rule.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the rule was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the rule was last updated.'),
});

export type FileTransferDlpRule = z.infer<typeof FileTransferDlpRuleSchema>;

export const CreateFileTransferDlpRuleSchema = FileTransferDlpRuleSchema.omit({ id: true, organizationId: true, createdAt: true, updatedAt: true });
export type CreateFileTransferDlpRule = z.infer<typeof CreateFileTransferDlpRuleSchema>;

export const UpdateFileTransferDlpRuleSchema = FileTransferDlpRuleSchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateFileTransferDlpRule = z.infer<typeof UpdateFileTransferDlpRuleSchema>;
