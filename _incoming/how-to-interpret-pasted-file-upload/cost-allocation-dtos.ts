import { z } from 'zod';

export const CostCategory = z.enum([
  'compute',
  'storage',
  'network',
  'database',
  'licensing',
  'support',
  'other',
]);

export const CostAllocationItemSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the cost allocation item.'),
  resourceId: z.string().uuid().optional().describe('ID of the resource associated with this cost (e.g., server, database).'),
  resourceName: z.string().optional().describe('Name of the resource.'),
  costCategory: CostCategory.describe('Category of the cost.'),
  amount: z.number().positive().describe('Cost amount in the primary currency.'),
  currency: z.string().min(3).max(3).default('USD').describe('Currency of the cost (e.g., USD, EUR).'),
  startDate: z.string().datetime().describe('Start date of the cost period.'),
  endDate: z.string().datetime().describe('End date of the cost period.'),
  projectId: z.string().uuid().optional().describe('ID of the project this cost is allocated to.'),
  departmentId: z.string().uuid().optional().describe('ID of the department this cost is allocated to.'),
  tags: z.record(z.string(), z.string()).optional().describe('Key-value tags for additional cost categorization.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the cost allocation item was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the cost allocation item was last updated.'),
});

export type CostAllocationItem = z.infer<typeof CostAllocationItemSchema>;

export const CreateCostAllocationItemSchema = CostAllocationItemSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateCostAllocationItem = z.infer<typeof CreateCostAllocationItemSchema>;

export const UpdateCostAllocationItemSchema = CostAllocationItemSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateCostAllocationItem = z.infer<typeof UpdateCostAllocationItemSchema>;
