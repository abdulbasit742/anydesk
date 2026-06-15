import { z } from 'zod';

export const HealthScoreFactorSchema = z.object({
  name: z.string().min(1).describe('Name of the health score factor (e.g., 

    User Engagement, Feature Adoption, Support Tickets).
  weight: z.number().min(0).max(1).describe("Weight of this factor in the overall health score (0-1)."),
  description: z.string().optional().describe("Description of what this factor measures."),
});

export const HealthScoreSchema = z.object({
  id: z.string().uuid().describe("Unique identifier for the health score record."),
  organizationId: z.string().uuid().describe("ID of the organization this health score belongs to."),
  score: z.number().min(0).max(100).describe("Overall health score (0-100)."),
  status: z.enum(["good", "neutral", "at_risk", "churn_risk"]).describe("Categorical health status."),
  factors: z.array(z.object({
    factorName: z.string().describe("Name of the factor."),
    value: z.number().describe("Value of the factor."),
    contribution: z.number().describe("Contribution of this factor to the overall score."),
    comment: z.string().optional().describe("Comments on this factor."),
  })).describe("Individual factor scores and their contributions."),
  calculatedAt: z.string().datetime().describe("Timestamp when the health score was calculated."),
  previousScore: z.number().min(0).max(100).optional().describe("Previous health score for trend analysis."),
  trend: z.enum(["improving", "stable", "declining"]).optional().describe("Trend of the health score."),
  createdAt: z.string().datetime().optional().describe("Timestamp when the record was created."),
  updatedAt: z.string().datetime().optional().describe("Timestamp when the record was last updated."),
});

export type HealthScore = z.infer<typeof HealthScoreSchema>;
export type HealthScoreFactor = z.infer<typeof HealthScoreFactorSchema>;

export const CreateHealthScoreSchema = HealthScoreSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateHealthScore = z.infer<typeof CreateHealthScoreSchema>;

export const UpdateHealthScoreSchema = HealthScoreSchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateHealthScore = z.infer<typeof UpdateHealthScoreSchema>;
