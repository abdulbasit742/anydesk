import { z } from 'zod';

export const EnrollmentTokenSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the enrollment token.'),
  organizationId: z.string().uuid().describe('ID of the organization this token belongs to.'),
  token: z.string().min(32).max(64).describe('The actual enrollment token string.'),
  expiresAt: z.string().datetime().describe('Timestamp when the enrollment token expires.'),
  createdBy: z.string().uuid().describe('ID of the user who created this token.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the token was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the token was last updated.'),
  status: z.enum(['active', 'expired', 'revoked']).default('active').describe('Current status of the enrollment token.'),
  usageLimit: z.number().int().min(1).optional().describe('Maximum number of times this token can be used.'),
  timesUsed: z.number().int().min(0).default(0).describe('Number of times this token has been used.'),
  policyId: z.string().uuid().optional().describe('Optional ID of an enrollment policy associated with this token.'),
});

export type EnrollmentToken = z.infer<typeof EnrollmentTokenSchema>;

export const CreateEnrollmentTokenSchema = EnrollmentTokenSchema.omit({ id: true, createdBy: true, createdAt: true, updatedAt: true, status: true, timesUsed: true });
export type CreateEnrollmentToken = z.infer<typeof CreateEnrollmentTokenSchema>;

export const UpdateEnrollmentTokenSchema = EnrollmentTokenSchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateEnrollmentToken = z.infer<typeof UpdateEnrollmentTokenSchema>;

export const EnrollmentTokenUsageSchema = z.object({
  tokenId: z.string().uuid().describe('ID of the enrollment token used.'),
  deviceId: z.string().uuid().describe('ID of the device enrolled.'),
  usedAt: z.string().datetime().describe('Timestamp when the token was used.'),
  ipAddress: z.string().ip().optional().describe('IP address from which the token was used.'),
});

export type EnrollmentTokenUsage = z.infer<typeof EnrollmentTokenUsageSchema>;
