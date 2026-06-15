import { z } from 'zod';

export const MarketplaceAppSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the marketplace application.'),
  name: z.string().min(1).describe('Name of the application.'),
  vendorId: z.string().uuid().describe('ID of the vendor who published the application.'),
  description: z.string().optional().describe('Detailed description of the application.'),
  shortDescription: z.string().max(250).optional().describe('Short description for listings.'),
  category: z.enum(['productivity', 'security', 'monitoring', 'utility', 'other']).describe('Category of the application.'),
  status: z.enum(['draft', 'pending_review', 'published', 'unpublished']).default('draft').describe('Current status of the application in the marketplace.'),
  pricingModel: z.enum(['free', 'freemium', 'subscription', 'one_time_purchase']).describe('Pricing model for the application.'),
  price: z.number().min(0).optional().describe('Price of the application, if applicable.'),
  currency: z.string().optional().describe('Currency of the price (e.g., USD).'),
  averageRating: z.number().min(0).max(5).optional().describe('Average user rating.'),
  totalReviews: z.number().int().min(0).optional().describe('Total number of reviews.'),
  installationCount: z.number().int().min(0).optional().describe('Number of times the app has been installed.'),
  logoUrl: z.string().url().optional().describe('URL to the application logo.'),
  screenshotUrls: z.array(z.string().url()).optional().describe('URLs to application screenshots.'),
  supportUrl: z.string().url().optional().describe('URL for application support.'),
  privacyPolicyUrl: z.string().url().optional().describe('URL to the application privacy policy.'),
  termsOfServiceUrl: z.string().url().optional().describe('URL to the application terms of service.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the application was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the application was last updated.'),
});

export type MarketplaceApp = z.infer<typeof MarketplaceAppSchema>;

export const CreateMarketplaceAppSchema = MarketplaceAppSchema.omit({ id: true, createdAt: true, updatedAt: true, averageRating: true, totalReviews: true, installationCount: true });
export type CreateMarketplaceApp = z.infer<typeof CreateMarketplaceAppSchema>;

export const UpdateMarketplaceAppSchema = MarketplaceAppSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateMarketplaceApp = z.infer<typeof UpdateMarketplaceAppSchema>;
