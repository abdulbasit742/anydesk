import { z } from 'zod';

export const ManagedConfigSchema = z.object({
  // General deployment settings
  deploymentId: z.string().uuid().describe('Unique identifier for this deployment instance.').optional(),
  environment: z.enum(['development', 'staging', 'production']).default('production').describe('Deployment environment.'),
  region: z.string().optional().describe('Geographical region of the deployment.'),

  // Security settings
  security:
    z.object({
      requireSessionReason: z.boolean().default(false).describe('If true, users must provide a reason for initiating a remote session.'),
      sessionInactivityTimeoutMinutes: z.number().int().min(5).max(1440).default(30).describe('Minutes of inactivity after which a session is automatically terminated.'),
      enableClipboardDlp: z.boolean().default(false).describe('If true, Data Loss Prevention for clipboard content is enabled.'),
      enableFileTransferDlp: z.boolean().default(false).describe('If true, Data Loss Prevention for file transfers is enabled.'),
      unattendedAccessPolicy: z.enum(['disabled', 'require_approval', 'enabled']).default('disabled').describe('Policy for unattended access sessions.'),
      auditLogRetentionDays: z.number().int().min(30).max(3650).default(365).describe('Number of days to retain audit logs.'),
    })
    .default({}),

  // SSO settings
  sso:
    z.object({
      enableSso: z.boolean().default(false).describe('If true, Single Sign-On is enabled.'),
      defaultSsoProvider: z.enum(['saml', 'oidc']).optional().describe('Default SSO provider if multiple are configured.'),
      samlConfigId: z.string().uuid().optional().describe('ID of the configured SAML provider.'),
      oidcConfigId: z.string().uuid().optional().describe('ID of the configured OIDC provider.'),
      domainVerificationRequired: z.boolean().default(false).describe('If true, domain ownership verification is required for SSO.'),
    })
    .default({}),

  // SCIM settings
  scim:
    z.object({
      enableScim: z.boolean().default(false).describe('If true, SCIM provisioning is enabled.'),
      scimEndpointUrl: z.string().url().optional().describe('SCIM endpoint URL for user and group provisioning.'),
      scimAuthToken: z.string().optional().describe('Authentication token for SCIM endpoint.'),
    })
    .default({}),

  // Device enrollment settings
  deviceEnrollment:
    z.object({
      enableEnrollmentTokens: z.boolean().default(false).describe('If true, device enrollment tokens are used for new devices.'),
      defaultEnrollmentPolicy: z.enum(['auto_approve', 'manual_approval']).default('manual_approval').describe('Default policy for new device enrollments.'),
      enrollmentTokenExpiryDays: z.number().int().min(1).max(365).default(7).describe('Days until an enrollment token expires.'),
    })
    .default({}),

  // Integrations
  integrations:
    z.object({
      enableSlackIntegration: z.boolean().default(false).describe('If true, Slack integration is enabled.'),
      enableTeamsIntegration: z.boolean().default(false).describe('If true, Microsoft Teams integration is enabled.'),
      enableZapierIntegration: z.boolean().default(false).describe('If true, Zapier integration is enabled.'),
    })
    .default({}),

  // API Productization
  apiProductization:
    z.object({
      enableApiAccess: z.boolean().default(false).describe('If true, external API access is enabled.'),
      defaultApiRateLimit: z.enum(['light', 'standard', 'heavy']).default('standard').describe('Default API rate limit tier.'),
      enableDeveloperPortal: z.boolean().default(false).describe('If true, the developer portal is accessible.'),
    })
    .default({}),
});

export type ManagedConfig = z.infer<typeof ManagedConfigSchema>;
