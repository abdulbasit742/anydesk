import { z } from 'zod';

export const MobileAppVersionSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the mobile app version.'),
  platform: z.enum(['ios', 'android']).describe('Mobile platform (iOS or Android).'),
  versionNumber: z.string().min(1).describe('Version number of the mobile app (e.g., 1.0.0).'),
  buildNumber: z.number().int().min(1).optional().describe('Build number of the mobile app.'),
  releaseDate: z.string().datetime().describe('Date when the version was released.'),
  isMandatoryUpdate: z.boolean().default(false).describe('Whether this is a mandatory update.'),
  releaseNotes: z.string().optional().describe('Release notes for this version.'),
  downloadUrl: z.string().url().optional().describe('URL to download the app package (e.g., APK, IPA).'),
  status: z.enum(['draft', 'pending_review', 'released', 'deprecated']).default('draft').describe('Current status of the app version.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the version record was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the version record was last updated.'),
});

export type MobileAppVersion = z.infer<typeof MobileAppVersionSchema>;

export const CreateMobileAppVersionSchema = MobileAppVersionSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateMobileAppVersion = z.infer<typeof CreateMobileAppVersionSchema>;

export const UpdateMobileAppVersionSchema = MobileAppVersionSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateMobileAppVersion = z.infer<typeof UpdateMobileAppVersionSchema>;
