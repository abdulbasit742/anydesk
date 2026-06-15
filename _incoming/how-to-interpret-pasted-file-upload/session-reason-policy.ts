import { z } from 'zod';

export const SessionReasonPolicySchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the session reason policy.'),
  organizationId: z.string().uuid().describe('ID of the organization this policy belongs to.'),
  enabled: z.boolean().default(false).describe('Whether requiring a session reason is enabled.'),
  reasonPrompt: z.string().min(1).optional().describe('The prompt displayed to the user when a session reason is required.'),
  reasonRequiredFor: z.enum(['all_sessions', 'unattended_sessions', 'specific_users_groups']).default('all_sessions').describe('Specifies when a session reason is required.'),
  exemptUserIds: z.array(z.string().uuid()).optional().describe('List of user IDs exempt from this policy.'),
  exemptGroupIds: z.array(z.string().uuid()).optional().describe('List of group IDs exempt from this policy.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the policy was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the policy was last updated.'),
});

export type SessionReasonPolicy = z.infer<typeof SessionReasonPolicySchema>;

export const CreateSessionReasonPolicySchema = SessionReasonPolicySchema.omit({ id: true, organizationId: true, createdAt: true, updatedAt: true });
export type CreateSessionReasonPolicy = z.infer<typeof CreateSessionReasonPolicySchema>;

export const UpdateSessionReasonPolicySchema = SessionReasonPolicySchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateSessionReasonPolicy = z.infer<typeof UpdateSessionReasonPolicySchema>;
