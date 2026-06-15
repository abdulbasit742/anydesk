import { z } from 'zod';

export const SensitivePatternType = z.enum([
  'credit_card_number',
  'social_security_number',
  'email_address',
  'ip_address',
  'phone_number',
  'api_key',
  'password',
  'custom',
]);

export const SensitivePatternSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the sensitive pattern.'),
  organizationId: z.string().uuid().optional().describe('ID of the organization this pattern belongs to (optional for global patterns).'),
  name: z.string().min(1).describe('Human-readable name for the sensitive pattern (e.g., "Visa Credit Card").'),
  type: SensitivePatternType.describe('Categorization of the sensitive data pattern.'),
  regex: z.string().min(1).describe('Regular expression to detect the sensitive pattern.'),
  description: z.string().optional().describe('Description of what this pattern detects.'),
  enabled: z.boolean().default(true).describe('Whether this pattern is active for detection.'),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('high').describe('Severity level associated with detecting this pattern.'),
  tags: z.array(z.string()).optional().describe('Tags for categorization (e.g., ["PCI", "PII"]).'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the pattern was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the pattern was last updated.'),
});

export type SensitivePattern = z.infer<typeof SensitivePatternSchema>;

export const CreateSensitivePatternSchema = SensitivePatternSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateSensitivePattern = z.infer<typeof CreateSensitivePatternSchema>;

export const UpdateSensitivePatternSchema = SensitivePatternSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateSensitivePattern = z.infer<typeof UpdateSensitivePatternSchema>;

// Pre-defined common sensitive patterns (examples)
export const predefinedSensitivePatterns: SensitivePattern[] = [
  {
    id: 'cc-visa-12345',
    organizationId: undefined,
    name: 'Visa Credit Card Number',
    type: 'credit_card_number',
    regex: '^4[0-9]{12}(?:[0-9]{3})?$',
    description: 'Detects common Visa credit card numbers.',
    enabled: true,
    severity: 'high',
    tags: ['PCI', 'credit_card'],
  },
  {
    id: 'ssn-us-67890',
    organizationId: undefined,
    name: 'US Social Security Number',
    type: 'social_security_number',
    regex: '^\\d{3}-\\d{2}-\\d{4}$',
    description: 'Detects US Social Security Numbers in XXX-XX-XXXX format.',
    enabled: true,
    severity: 'critical',
    tags: ['PII', 'HIPAA'],
  },
  {
    id: 'email-generic-11223',
    organizationId: undefined,
    name: 'Generic Email Address',
    type: 'email_address',
    regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    description: 'Detects common email address formats.',
    enabled: true,
    severity: 'low',
    tags: ['PII'],
  },
  {
    id: 'ip-v4-generic-33445',
    organizationId: undefined,
    name: 'IPv4 Address',
    type: 'ip_address',
    regex: '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    description: 'Detects IPv4 addresses.',
    enabled: true,
    severity: 'low',
    tags: ['network'],
  },
];

// Utility function to check content against sensitive patterns
export function detectSensitiveData(content: string, patterns: SensitivePattern[]): SensitivePattern[] {
  const detected: SensitivePattern[] = [];
  for (const pattern of patterns) {
    if (pattern.enabled) {
      const regex = new RegExp(pattern.regex);
      if (regex.test(content)) {
        detected.push(pattern);
      }
    }
  }
  return detected;
}
