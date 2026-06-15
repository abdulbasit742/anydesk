import { z } from 'zod';

export const SessionRecordingConsentSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the recording consent record.'),
  organizationId: z.string().uuid().describe('ID of the organization this consent belongs to.'),
  sessionId: z.string().uuid().describe('ID of the session to which this consent applies.'),
  hostUserId: z.string().uuid().describe('ID of the host user for the session.'),
  guestUserId: z.string().uuid().optional().describe('ID of the guest user for the session, if applicable.'),
  consentRequired: z.boolean().default(true).describe('Whether explicit consent was required for this session.'),
  hostConsentGiven: z.boolean().default(false).describe('Whether the host user explicitly gave consent to record.'),
  guestConsentGiven: z.boolean().default(false).describe('Whether the guest user explicitly gave consent to record.'),
  consentTimestamp: z.string().datetime().describe('Timestamp when consent was given.'),
  consentMechanism: z.enum(['explicit_ui', 'implied_policy']).default('explicit_ui').describe('Mechanism by which consent was obtained.'),
  policySnapshot: z.record(z.any()).optional().describe('Snapshot of the recording policy at the time of consent.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the consent record was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the consent record was last updated.'),
});

export type SessionRecordingConsent = z.infer<typeof SessionRecordingConsentSchema>;

export const CreateSessionRecordingConsentSchema = SessionRecordingConsentSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateSessionRecordingConsent = z.infer<typeof CreateSessionRecordingConsentSchema>;

export const UpdateSessionRecordingConsentSchema = SessionRecordingConsentSchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateSessionRecordingConsent = z.infer<typeof UpdateSessionRecordingConsentSchema>;
