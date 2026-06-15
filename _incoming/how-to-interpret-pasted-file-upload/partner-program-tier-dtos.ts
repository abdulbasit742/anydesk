import { z } from 'zod';

export const PartnerProgramTierSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the partner program tier.'),
  name: z.string().min(1).describe('Name of the partner tier (e.g., Bronze, Silver, Gold, Platinum).'),
  description: z.string().optional().describe('Description of the benefits and requirements for this tier.'),
  minimumRevenueCommitment: z.number().min(0).optional().describe('Minimum revenue commitment for this tier.'),
  commissionRate: z.number().min(0).max(1).optional().describe('Default commission rate for this tier (0-1).'),
  benefits: z.array(z.string()).optional().describe('List of benefits for this tier (e.g., Dedicated Partner Manager, Co-marketing Funds).'),
  requirements: z.array(z.string()).optional().describe('List of requirements for this tier (e.g., Annual Certification, Quarterly Business Reviews).'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the tier was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the tier was last updated.'),
});

export type PartnerProgramTier = z.infer<typeof PartnerProgramTierSchema>;

export const CreatePartnerProgramTierSchema = PartnerProgramTierSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreatePartnerProgramTier = z.infer<typeof CreatePartnerProgramTierSchema>;

export const UpdatePartnerProgramTierSchema = PartnerProgramTierSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdatePartnerProgramTier = z.infer<typeof UpdatePartnerProgramTierSchema>;
