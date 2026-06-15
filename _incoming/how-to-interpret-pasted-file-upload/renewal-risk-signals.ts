import { z } from 'zod';

export const RenewalRiskFactorSchema = z.object({
  name: z.string().min(1).describe('Name of the risk factor (e.g., Low Usage, Support Issues, Feature Gaps).'),
  severity: z.enum(['low', 'medium', 'high', 'critical']).describe('Severity of this risk factor.'),
  description: z.string().optional().describe('Description of what this factor indicates.'),
});

export const RenewalRiskSignalSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the renewal risk signal.'),
  organizationId: z.string().uuid().describe('ID of the organization this signal belongs to.'),
  signalDate: z.string().datetime().describe('Timestamp when the risk signal was identified.'),
  riskScore: z.number().min(0).max(100).describe('Overall risk score for renewal (0-100, higher is riskier).'),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']).describe('Categorical risk level.'),
  factors: z.array(z.object({
    factorName: z.string().describe('Name of the risk factor.'),
    detectedValue: z.any().optional().describe('Value that triggered the risk factor.'),
    comment: z.string().optional().describe('Comments on this risk factor.'),
  })).describe('Individual risk factors contributing to the signal.'),
  recommendedAction: z.string().optional().describe('Suggested action to mitigate the risk.'),
  resolved: z.boolean().default(false).describe('Whether the risk signal has been addressed.'),
  resolvedAt: z.string().datetime().optional().describe('Timestamp when the risk signal was resolved.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the signal was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the signal was last updated.'),
});

export type RenewalRiskSignal = z.infer<typeof RenewalRiskSignalSchema>;
export type RenewalRiskFactor = z.infer<typeof RenewalRiskFactorSchema>;

export const CreateRenewalRiskSignalSchema = RenewalRiskSignalSchema.omit({ id: true, createdAt: true, updatedAt: true, resolved: true, resolvedAt: true });
export type CreateRenewalRiskSignal = z.infer<typeof CreateRenewalRiskSignalSchema>;

export const UpdateRenewalRiskSignalSchema = RenewalRiskSignalSchema.partial().extend({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
});
export type UpdateRenewalRiskSignal = z.infer<typeof UpdateRenewalRiskSignalSchema>;
