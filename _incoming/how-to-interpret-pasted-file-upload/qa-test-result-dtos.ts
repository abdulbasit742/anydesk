import { z } from 'zod';

export const QaTestStatus = z.enum([
  'passed',
  'failed',
  'skipped',
  'in_progress',
]);

export const QaTestResultSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the QA test result.'),
  testSuite: z.string().min(1).describe('Name of the test suite (e.g., E2E, Integration, Unit).'),
  testCase: z.string().min(1).describe('Name of the specific test case.'),
  status: QaTestStatus.describe('Overall status of the test case execution.'),
  durationMs: z.number().int().min(0).optional().describe('Duration of the test execution in milliseconds.'),
  environment: z.string().optional().describe('Test environment where the test was run (e.g., staging, production).'),
  browser: z.string().optional().describe('Browser used for web tests (e.g., Chrome, Firefox).'),
  os: z.string().optional().describe('Operating system used for tests.'),
  errorMessage: z.string().optional().describe('Error message if the test failed.'),
  screenshotUrl: z.string().url().optional().describe('URL to a screenshot taken on failure.'),
  logOutput: z.string().optional().describe('Relevant log output from the test run.'),
  runId: z.string().uuid().optional().describe('ID of the test run this result belongs to.'),
  executedBy: z.string().uuid().optional().describe('ID of the user or system that executed the test.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the test result was recorded.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the test result was last updated.'),
});

export type QaTestResult = z.infer<typeof QaTestResultSchema>;

export const CreateQaTestResultSchema = QaTestResultSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateQaTestResult = z.infer<typeof CreateQaTestResultSchema>;

export const UpdateQaTestResultSchema = QaTestResultSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateQaTestResult = z.infer<typeof UpdateQaTestResultSchema>;
