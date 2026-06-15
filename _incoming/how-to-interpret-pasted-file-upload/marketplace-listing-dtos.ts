import { z } from 'zod';

export const MarketplaceListingSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the marketplace listing.'),
  appId: z.string().uuid().describe('ID of the application being listed.'),
  marketplaceId: z.string().uuid().describe('ID of the marketplace where the app is listed.'),
  status: z.enum(['active', 'inactive', 'archived']).default('active').describe('Status of the listing.'),
  visibility: z.enum(['public', 'private', 'unlisted']).default('public').describe('Visibility of the listing.'),
  listingDate: z.string().datetime().optional().describe('Date when the listing became active.'),
  removalDate: z.string().datetime().optional().describe('Date when the listing was removed.'),
  metadata: z.record(z.any()).optional().describe('Additional metadata specific to the listing.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the listing was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the listing was last updated.'),
});

export type MarketplaceListing = z.infer<typeof MarketplaceListingSchema>;

export const CreateMarketplaceListingSchema = MarketplaceListingSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateMarketplaceListing = z.infer<typeof CreateMarketplaceListingSchema>;

export const UpdateMarketplaceListingSchema = MarketplaceListingSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateMarketplaceListing = z.infer<typeof UpdateMarketplaceListingSchema>;
