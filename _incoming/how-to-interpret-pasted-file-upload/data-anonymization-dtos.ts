import { z } from 'zod';

export const AnonymizationMethod = z.enum([
  'masking',
  'hashing',
  'tokenization',
  'shuffling',
  'encryption',
  'generalization',
  'suppression',
]);

export const DataAnonymizationRuleSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the anonymization rule.'),
  name: z.string().min(1).describe('Name of the anonymization rule.'),
  description: z.string().optional().describe('Description of the rule.'),
  isEnabled: z.boolean().default(true).describe('Whether the rule is active.'),
  targetField: z.string().min(1).describe('The data field to which this rule applies (e.g., user.email, device.ipAddress).'),
  anonymizationMethod: AnonymizationMethod.describe('The method used for anonymizing the data.'),
  configuration: z.record(z.any()).optional().describe('Method-specific configuration (e.g., hashing algorithm, masking pattern).'),
  appliesToEnvironments: z.array(z.string()).optional().describe('Environments where this rule should be applied (e.g., development, staging).'),
  createdBy: z.string().uuid().optional().describe('ID of the user who created the rule.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the rule was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the rule was last updated.'),
});

export type DataAnonymizationRule = z.infer<typeof DataAnonymizationRuleSchema>;

export const CreateDataAnonymizationRuleSchema = DataAnonymizationRuleSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateDataAnonymizationRule = z.infer<typeof CreateDataAnonymizationRuleSchema>;

export const UpdateDataAnonymizationRuleSchema = DataAnonymizationRuleSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateDataAnonymizationRule = z.infer<typeof UpdateDataAnonymizationRuleSchema>;

export const DataPseudonymizationMappingSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the pseudonymization mapping.'),
  originalValueHash: z.string().min(1).describe('Hash of the original sensitive value.'),
  pseudonym: z.string().min(1).describe('The generated pseudonym for the original value.'),
  anonymizationRuleId: z.string().uuid().optional().describe('ID of the anonymization rule that generated this pseudonym.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the mapping was created.'),
});

export type DataPseudonymizationMapping = z.infer<typeof DataPseudonymizationMappingSchema>;

export const CreateDataPseudonymizationMappingSchema = DataPseudonymizationMappingSchema.omit({ id: true, createdAt: true });
export type CreateDataPseudonymizationMapping = z.infer<typeof CreateDataPseudonymizationMappingSchema>;
