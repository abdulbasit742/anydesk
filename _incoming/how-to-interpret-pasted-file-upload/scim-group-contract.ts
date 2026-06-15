import { z } from 'zod';

export const ScimGroupSchema = z.object({
  schemas: z.array(z.literal('urn:ietf:params:scim:schemas:core:2.0:Group')).default(['urn:ietf:params:scim:schemas:core:2.0:Group']),
  id: z.string().optional().describe('A unique identifier for the SCIM resource as defined by the service provider.'),
  externalId: z.string().optional().describe('A unique identifier for the resource as defined by the provisioning client.'),
  meta: z.object({
    resourceType: z.literal('Group').default('Group'),
    created: z.string().datetime().optional(),
    lastModified: z.string().datetime().optional(),
    location: z.string().url().optional(),
    version: z.string().optional(),
  }).optional(),
  displayName: z.string().min(1).describe('A human-readable name for the group.'),
  members: z.array(z.object({
    value: z.string().optional().describe('The ID of a SCIM user.'),
    display: z.string().optional().describe('The display name of a SCIM user.'),
    $ref: z.string().url().optional().describe('The URI of a SCIM user resource.'),
  })).optional().describe('A list of members of the group.'),
});

export type ScimGroup = z.infer<typeof ScimGroupSchema>;

export const CreateScimGroupSchema = ScimGroupSchema.omit({ id: true, meta: true, createdAt: true, updatedAt: true });
export type CreateScimGroup = z.infer<typeof CreateScimGroupSchema>;

export const UpdateScimGroupSchema = ScimGroupSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateScimGroup = z.infer<typeof UpdateScimGroupSchema>;
