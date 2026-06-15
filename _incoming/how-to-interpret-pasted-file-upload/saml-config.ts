import { z } from 'zod';

export const SamlConfigSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the SAML configuration.'),
  organizationId: z.string().uuid().describe('ID of the organization this SAML config belongs to.'),
  providerName: z.string().min(1).describe('Name of the SAML Identity Provider (e.g., Okta, Azure AD).'),
  entryPoint: z.string().url().describe('The URL to which SAML authentication requests are sent.'),
  issuer: z.string().min(1).describe('The unique identifier of the SAML Identity Provider.'),
  certificate: z.string().min(1).describe('The public X.509 certificate of the SAML Identity Provider.'),
  callbackUrl: z.string().url().describe('The URL on the Service Provider (RemoteDesk) where SAML responses are sent.'),
  // Optional settings
  logoutUrl: z.string().url().optional().describe('Optional URL for Single Logout (SLO).'),
  signatureAlgorithm: z.enum(['sha1', 'sha256', 'sha512']).default('sha256').describe('Algorithm used for signing SAML messages.'),
  digestAlgorithm: z.enum(['sha1', 'sha256', 'sha512']).default('sha256').describe('Algorithm used for digesting SAML messages.'),
  forceAuthn: z.boolean().default(false).describe('If true, forces re-authentication at the IdP even if a session exists.'),
  identifierFormat: z.string().optional().describe('Specifies the format of the NameID in the SAML assertion.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the SAML configuration was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the SAML configuration was last updated.'),
});

export type SamlConfig = z.infer<typeof SamlConfigSchema>;

export const CreateSamlConfigSchema = SamlConfigSchema.omit({ id: true, organizationId: true, createdAt: true, updatedAt: true });
export type CreateSamlConfig = z.infer<typeof CreateSamlConfigSchema>;

export const UpdateSamlConfigSchema = SamlConfigSchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateSamlConfig = z.infer<typeof UpdateSamlConfigSchema>;
