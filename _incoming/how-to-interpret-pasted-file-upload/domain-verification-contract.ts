import { z } from 'zod';

export const DomainVerificationStatus = z.enum(['pending', 'verified', 'failed']);

export const DomainVerificationSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the domain verification record.'),
  organizationId: z.string().uuid().describe('ID of the organization requesting domain verification.'),
  domain: z.string().min(1).describe('The domain to be verified (e.g., example.com).'),
  verificationMethod: z.enum(['dns_txt', 'http_file']).default('dns_txt').describe('Method used for domain verification.'),
  verificationToken: z.string().min(1).describe('The token to be used for verification (e.g., TXT record value, file content).'),
  status: DomainVerificationStatus.default('pending').describe('Current status of the domain verification.'),
  expiresAt: z.string().datetime().optional().describe('Timestamp when the verification token expires.'),
  verifiedAt: z.string().datetime().optional().describe('Timestamp when the domain was successfully verified.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the verification record was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the verification record was last updated.'),
});

export type DomainVerification = z.infer<typeof DomainVerificationSchema>;

export const CreateDomainVerificationSchema = DomainVerificationSchema.omit({ id: true, status: true, verifiedAt: true, createdAt: true, updatedAt: true });
export type CreateDomainVerification = z.infer<typeof CreateDomainVerificationSchema>;

export const UpdateDomainVerificationSchema = DomainVerificationSchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateDomainVerification = z.infer<typeof UpdateDomainVerificationSchema>;
