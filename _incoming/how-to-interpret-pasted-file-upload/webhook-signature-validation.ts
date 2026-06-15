import { z } from 'zod';

export const WebhookSignatureAlgorithm = z.enum([
  'HMAC_SHA256',
  'HMAC_SHA512',
]);

export const WebhookSignatureConfigSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the webhook signature configuration.'),
  webhookId: z.string().uuid().describe('ID of the webhook this configuration applies to.'),
  secret: z.string().min(32).describe('Secret key used for generating and validating webhook signatures.'),
  algorithm: WebhookSignatureAlgorithm.default('HMAC_SHA256').describe('Hashing algorithm used for the signature.'),
  headerName: z.string().min(1).default('X-Webhook-Signature').describe('Name of the HTTP header containing the signature.'),
  timestampToleranceSeconds: z.number().int().min(0).default(300).describe('Tolerance in seconds for timestamp validation to prevent replay attacks.'),
  isEnabled: z.boolean().default(true).describe('Whether signature validation is enabled for this webhook.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the configuration was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the configuration was last updated.'),
});

export type WebhookSignatureConfig = z.infer<typeof WebhookSignatureConfigSchema>;

export const CreateWebhookSignatureConfigSchema = WebhookSignatureConfigSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateWebhookSignatureConfig = z.infer<typeof CreateWebhookSignatureConfigSchema>;

export const UpdateWebhookSignatureConfigSchema = WebhookSignatureConfigSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateWebhookSignatureConfig = z.infer<typeof UpdateWebhookSignatureConfigSchema>;
