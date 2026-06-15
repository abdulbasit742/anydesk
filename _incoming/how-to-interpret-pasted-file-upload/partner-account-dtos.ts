import { z } from 'zod';

export const PartnerAccountSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the partner account.'),
  name: z.string().min(1).describe('Name of the partner organization.'),
  contactEmail: z.string().email().describe('Primary contact email for the partner.'),
  contactName: z.string().optional().describe('Primary contact person for the partner.'),
  status: z.enum(['active', 'inactive', 'pending_approval']).default('pending_approval').describe('Current status of the partner account.'),
  partnerType: z.enum(['reseller', 'integration', 'referral', 'technology']).describe('Type of partnership.'),
  commissionRate: z.number().min(0).max(1).optional().describe('Commission rate for resellers (0-1).'),
  referralCode: z.string().optional().describe('Unique code for tracking referrals.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the partner account was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the partner account was last updated.'),
  // Address information
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  stateProvince: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  // Billing information (for resellers)
  billingEmail: z.string().email().optional().describe('Email for billing-related communications.'),
  paymentTerms: z.string().optional().describe('Payment terms for the partner (e.g., Net 30).'),
});

export type PartnerAccount = z.infer<typeof PartnerAccountSchema>;

export const CreatePartnerAccountSchema = PartnerAccountSchema.omit({ id: true, createdAt: true, updatedAt: true, status: true });
export type CreatePartnerAccount = z.infer<typeof CreatePartnerAccountSchema>;

export const UpdatePartnerAccountSchema = PartnerAccountSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdatePartnerAccount = z.infer<typeof UpdatePartnerAccountSchema>;
