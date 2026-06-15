import { z } from 'zod';

export const UsageSummarySchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the usage summary record.'),
  organizationId: z.string().uuid().describe('ID of the organization this usage summary belongs to.'),
  periodStart: z.string().datetime().describe('Start timestamp of the usage period.'),
  periodEnd: z.string().datetime().describe('End timestamp of the usage period.'),
  totalSessions: z.number().int().min(0).describe('Total number of remote sessions during the period.'),
  totalSessionMinutes: z.number().int().min(0).describe('Total duration of remote sessions in minutes.'),
  uniqueHosts: z.number().int().min(0).describe('Number of unique host devices used.'),
  uniqueGuests: z.number().int().min(0).describe('Number of unique guest users connected.'),
  dataTransferredGb: z.number().min(0).describe('Total data transferred during sessions in GB.'),
  featuresUsed: z.record(z.number().int().min(0)).optional().describe('Count of usage for specific features (e.g., { fileTransfer: 10, chatMessages: 100 }).'),
  topUsers: z.array(z.object({
    userId: z.string().uuid(),
    sessionMinutes: z.number().int().min(0),
  })).optional().describe('List of top users by session minutes.'),
  topDevices: z.array(z.object({
    deviceId: z.string().uuid(),
    sessionMinutes: z.number().int().min(0),
  })).optional().describe('List of top devices by session minutes.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the summary was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the summary was last updated.'),
});

export type UsageSummary = z.infer<typeof UsageSummarySchema>;

export const CreateUsageSummarySchema = UsageSummarySchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateUsageSummary = z.infer<typeof CreateUsageSummarySchema>;

export const UpdateUsageSummarySchema = UsageSummarySchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateUsageSummary = z.infer<typeof UpdateUsageSummarySchema>;
