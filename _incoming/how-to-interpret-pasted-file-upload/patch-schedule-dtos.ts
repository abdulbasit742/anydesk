import { z } from 'zod';

export const PatchScheduleFrequency = z.enum([
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'annually',
  'on_demand',
]);

export const PatchScheduleStatus = z.enum([
  'pending',
  'in_progress',
  'completed',
  'failed',
  'cancelled',
]);

export const PatchScheduleSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the patch schedule.'),
  name: z.string().min(1).describe('Name of the patch schedule.'),
  description: z.string().optional().describe('Description of the patch schedule.'),
  targetGroups: z.array(z.string().uuid()).describe('List of device group IDs to apply patches to.'),
  patchVersion: z.string().min(1).describe('Version of the patch to be applied.'),
  scheduledAt: z.string().datetime().describe('Timestamp when the patch is scheduled to run.'),
  frequency: PatchScheduleFrequency.describe('How often the patch schedule should run.'),
  status: PatchScheduleStatus.default('pending').describe('Current status of the patch schedule.'),
  initiatedBy: z.string().uuid().optional().describe('ID of the user or system that initiated the schedule.'),
  completedAt: z.string().datetime().optional().describe('Timestamp when the patch schedule was completed.'),
  failureReason: z.string().optional().describe('Reason for failure, if applicable.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the patch schedule was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the patch schedule was last updated.'),
});

export type PatchSchedule = z.infer<typeof PatchScheduleSchema>;

export const CreatePatchScheduleSchema = PatchScheduleSchema.omit({ id: true, status: true, completedAt: true, failureReason: true, createdAt: true, updatedAt: true });
export type CreatePatchSchedule = z.infer<typeof CreatePatchScheduleSchema>;

export const UpdatePatchScheduleSchema = PatchScheduleSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdatePatchSchedule = z.infer<typeof UpdatePatchScheduleSchema>;
