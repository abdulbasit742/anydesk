import { z } from 'zod';

export const DeviceGroupSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the device group.'),
  organizationId: z.string().uuid().describe('ID of the organization this group belongs to.'),
  name: z.string().min(1).describe('Name of the device group.'),
  description: z.string().optional().describe('Description of the device group.'),
  deviceIds: z.array(z.string().uuid()).optional().describe('List of device IDs belonging to this group.'),
  tags: z.array(z.string()).optional().describe('Tags for categorization (e.g., 

    Windows, Linux, Production, Staging).
  createdAt: z.string().datetime().optional().describe("Timestamp when the group was created."),
  updatedAt: z.string().datetime().optional().describe("Timestamp when the group was last updated."),
});

export type DeviceGroup = z.infer<typeof DeviceGroupSchema>;

export const CreateDeviceGroupSchema = DeviceGroupSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateDeviceGroup = z.infer<typeof CreateDeviceGroupSchema>;

export const UpdateDeviceGroupSchema = DeviceGroupSchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateDeviceGroup = z.infer<typeof UpdateDeviceGroupSchema>;
