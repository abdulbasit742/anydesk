import { z } from 'zod';

export const ApiKeySchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the API key.'),
  organizationId: z.string().uuid().describe('ID of the organization this API key belongs to.'),
  name: z.string().min(1).describe('Human-readable name for the API key.'),
  key: z.string().min(32).describe('The actual API key string (hashed or encrypted in storage).'),
  prefix: z.string().max(8).optional().describe('Optional prefix for the API key to identify its type.'),
  status: z.enum(['active', 'inactive', 'revoked']).default('active').describe('Current status of the API key.'),
  permissions: z.array(z.string()).optional().describe('List of permissions granted to this API key (e.g., [

    read:sessions"]).
  expiresAt: z.string().datetime().optional().describe("Timestamp when the API key will expire."),
  lastUsedAt: z.string().datetime().optional().describe("Timestamp when the API key was last used."),
  createdAt: z.string().datetime().optional().describe("Timestamp when the API key was created."),
  updatedAt: z.string().datetime().optional().describe("Timestamp when the API key was last updated."),
});

export type ApiKey = z.infer<typeof ApiKeySchema>;

export const CreateApiKeySchema = ApiKeySchema.omit({ id: true, createdAt: true, updatedAt: true, lastUsedAt: true, status: true });
export type CreateApiKey = z.infer<typeof CreateApiKeySchema>;

export const UpdateApiKeySchema = ApiKeySchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateApiKey = z.infer<typeof UpdateApiKeySchema>;
