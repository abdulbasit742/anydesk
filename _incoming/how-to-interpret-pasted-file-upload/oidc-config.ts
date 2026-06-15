import { z } from 'zod';

export const OidcConfigSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the OIDC configuration.'),
  organizationId: z.string().uuid().describe('ID of the organization this OIDC config belongs to.'),
  providerName: z.string().min(1).describe('Name of the OIDC Identity Provider (e.g., Google, Auth0).'),
  clientId: z.string().min(1).describe('The client ID issued by the authorization server.'),
  clientSecret: z.string().min(1).describe('The client secret issued by the authorization server.'),
  issuer: z.string().url().describe('The URL of the OIDC issuer.'),
  authorizationUrl: z.string().url().optional().describe('The URL for the authorization endpoint.'),
  tokenUrl: z.string().url().optional().describe('The URL for the token endpoint.'),
  userInfoUrl: z.string().url().optional().describe('The URL for the user info endpoint.'),
  redirectUrl: z.string().url().describe('The URL on the Service Provider (RemoteDesk) where the user agent is redirected after authorization.'),
  scope: z.string().default('openid profile email').describe('Space-separated list of scopes requested.'),
  responseType: z.enum(['code', 'id_token', 'token']).default('code').describe('The OAuth 2.0 response type.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the OIDC configuration was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the OIDC configuration was last updated.'),
});

export type OidcConfig = z.infer<typeof OidcConfigSchema>;

export const CreateOidcConfigSchema = OidcConfigSchema.omit({ id: true, organizationId: true, createdAt: true, updatedAt: true });
export type CreateOidcConfig = z.infer<typeof CreateOidcConfigSchema>;

export const UpdateOidcConfigSchema = OidcConfigSchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateOidcConfig = z.infer<typeof UpdateOidcConfigSchema>;
