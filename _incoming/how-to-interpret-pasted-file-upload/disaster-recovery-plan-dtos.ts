import { z } from 'zod';

export const DisasterRecoveryPlanSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the disaster recovery plan.'),
  organizationId: z.string().uuid().describe('ID of the organization this plan belongs to.'),
  name: z.string().min(1).describe('Name of the disaster recovery plan.'),
  description: z.string().optional().describe('Description of the plan.'),
  status: z.enum(['draft', 'active', 'under_review', 'archived']).default('draft').describe('Current status of the plan.'),
  lastTestedAt: z.string().datetime().optional().describe('Timestamp when the plan was last tested.'),
  nextTestDueAt: z.string().datetime().optional().describe('Timestamp when the next test is due.'),
  recoveryTimeObjective: z.string().optional().describe('RTO: Maximum tolerable duration of disruption.'),
  recoveryPointObjective: z.string().optional().describe('RPO: Maximum tolerable period in which data might be lost.'),
  componentsAffected: z.array(z.string()).optional().describe('List of system components covered by this plan.'),
  recoverySteps: z.array(z.object({
    stepNumber: z.number().int().min(1),
    description: z.string().min(1),
    responsibleTeam: z.string().optional(),
    estimatedTimeMinutes: z.number().int().min(1).optional(),
  })).optional().describe('Detailed steps for recovery.'),
  communicationPlan: z.string().optional().describe('Plan for internal and external communication during a disaster.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the plan was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the plan was last updated.'),
});

export type DisasterRecoveryPlan = z.infer<typeof DisasterRecoveryPlanSchema>;

export const CreateDisasterRecoveryPlanSchema = DisasterRecoveryPlanSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateDisasterRecoveryPlan = z.infer<typeof CreateDisasterRecoveryPlanSchema>;

export const UpdateDisasterRecoveryPlanSchema = DisasterRecoveryPlanSchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateDisasterRecoveryPlan = z.infer<typeof UpdateDisasterRecoveryPlanSchema>;
