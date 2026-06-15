import { z } from 'zod';

export const SessionDurationPolicySchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the session duration policy.'),
  organizationId: z.string().uuid().describe('ID of the organization this policy belongs to.'),
  enabled: z.boolean().default(false).describe('Whether session duration enforcement is enabled.'),
  maxDurationMinutes: z.number().int().min(1).max(1440).optional().describe('Maximum allowed session duration in minutes. 1440 minutes = 24 hours.'),
  warningThresholdMinutes: z.number().int().min(1).optional().describe('Minutes before maxDurationMinutes to send a warning notification.'),
  enforceFor: z.enum(['all_sessions', 'unattended_sessions', 'specific_users_groups']).default('all_sessions').describe('Specifies for which sessions duration is enforced.'),
  exemptUserIds: z.array(z.string().uuid()).optional().describe('List of user IDs exempt from this policy.'),
  exemptGroupIds: z.array(z.string().uuid()).optional().describe('List of group IDs exempt from this policy.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the policy was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the policy was last updated.'),
});

export type SessionDurationPolicy = z.infer<typeof SessionDurationPolicySchema>;

export const CreateSessionDurationPolicySchema = SessionDurationPolicySchema.omit({ id: true, organizationId: true, createdAt: true, updatedAt: true });
export type CreateSessionDurationPolicy = z.infer<typeof CreateSessionDurationPolicySchema>;

export const UpdateSessionDurationPolicySchema = SessionDurationPolicySchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateSessionDurationPolicy = z.infer<typeof UpdateSessionDurationPolicySchema>;


// Helper function to check and enforce session duration
export function enforceSessionDuration(sessionStartTime: Date, policy: SessionDurationPolicy): {
  shouldTerminate: boolean;
  warningIssued: boolean;
  remainingMinutes: number;
} {
  if (!policy.enabled || !policy.maxDurationMinutes) {
    return { shouldTerminate: false, warningIssued: false, remainingMinutes: Infinity };
  }

  const now = new Date();
  const elapsedMilliseconds = now.getTime() - sessionStartTime.getTime();
  const elapsedMinutes = Math.floor(elapsedMilliseconds / (1000 * 60));

  const remainingMinutes = policy.maxDurationMinutes - elapsedMinutes;

  let shouldTerminate = false;
  let warningIssued = false;

  if (elapsedMinutes >= policy.maxDurationMinutes) {
    shouldTerminate = true;
  } else if (policy.warningThresholdMinutes && remainingMinutes <= policy.warningThresholdMinutes) {
    warningIssued = true;
  }

  return { shouldTerminate, warningIssued, remainingMinutes };
}
