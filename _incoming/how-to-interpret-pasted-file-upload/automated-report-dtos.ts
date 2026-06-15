import { z } from 'zod';

export const ComplianceStandard = z.enum([
  'SOC2',
  'ISO27001',
  'GDPR',
  'HIPAA',
  'PCI_DSS',
  'CCPA',
  'OTHER',
]);

export const ReportStatus = z.enum([
  'pending',
  'generating',
  'completed',
  'failed',
  'reviewed',
]);

export const AutomatedComplianceReportSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the automated compliance report.'),
  name: z.string().min(1).describe('Name of the compliance report.'),
  complianceStandard: ComplianceStandard.describe('The compliance standard this report addresses.'),
  generationDate: z.string().datetime().describe('Timestamp when the report was generated.'),
  periodStart: z.string().datetime().describe('Start date of the reporting period.'),
  periodEnd: z.string().datetime().describe('End date of the reporting period.'),
  status: ReportStatus.default('pending').describe('Current status of the report generation.'),
  reportUrl: z.string().url().optional().describe('URL to the generated report document.'),
  generatedBy: z.string().uuid().optional().describe('ID of the user or system that generated the report.'),
  reviewers: z.array(z.string().uuid()).optional().describe('List of user IDs who reviewed the report.'),
  reviewDate: z.string().datetime().optional().describe('Timestamp when the report was last reviewed.'),
  findingsSummary: z.string().optional().describe('Summary of key findings or non-conformities.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the report record was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the report record was last updated.'),
});

export type AutomatedComplianceReport = z.infer<typeof AutomatedComplianceReportSchema>;

export const CreateAutomatedComplianceReportSchema = AutomatedComplianceReportSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateAutomatedComplianceReport = z.infer<typeof CreateAutomatedComplianceReportSchema>;

export const UpdateAutomatedComplianceReportSchema = AutomatedComplianceReportSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateAutomatedComplianceReport = z.infer<typeof UpdateAutomatedComplianceReportSchema>;
