import { z } from 'zod';

export const PrivacySettingsSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the privacy settings record.'),
  organizationId: z.string().uuid().describe('ID of the organization these settings belong to.'),
  dataCollectionEnabled: z.boolean().default(true).describe('Whether general data collection is enabled.'),
  telemetryEnabled: z.boolean().default(true).describe('Whether anonymous telemetry data collection is enabled.'),
  sessionRecordingConsentRequired: z.boolean().default(true).describe('Whether explicit consent is required for session recording.'),
  dataRetentionPolicyId: z.string().uuid().optional().describe('ID of the associated data retention policy.'),
  thirdPartySharingEnabled: z.boolean().default(false).describe('Whether data can be shared with third-party services.'),
  auditLogRetentionDays: z.number().int().min(30).default(365).describe('Number of days to retain audit logs.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the settings were created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the settings were last updated.'),
});

export type PrivacySettings = z.infer<typeof PrivacySettingsSchema>;

export const CreatePrivacySettingsSchema = PrivacySettingsSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreatePrivacySettings = z.infer<typeof CreatePrivacySettingsSchema>;

export const UpdatePrivacySettingsSchema = PrivacySettingsSchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdatePrivacySettings = z.infer<typeof UpdatePrivacySettingsSchema>;
