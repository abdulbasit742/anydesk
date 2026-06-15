import { z } from 'zod';

export const ScriptExecutionStatus = z.enum([
  'pending',
  'in_progress',
  'completed',
  'failed',
  'cancelled',
]);

export const ScriptExecutionRequestSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the script execution request.'),
  scriptId: z.string().uuid().describe('ID of the script to be executed.'),
  targetDeviceIds: z.array(z.string().uuid()).min(1).describe('List of device IDs to execute the script on.'),
  parameters: z.record(z.string(), z.string()).optional().describe('Key-value pairs of parameters to pass to the script.'),
  initiatedBy: z.string().uuid().describe('ID of the user or system that initiated the script execution.'),
  scheduledAt: z.string().datetime().optional().describe('Timestamp when the script execution is scheduled.'),
  timeoutSeconds: z.number().int().min(30).default(300).describe('Maximum time in seconds to allow for script execution.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the request was created.'),
});

export type ScriptExecutionRequest = z.infer<typeof ScriptExecutionRequestSchema>;

export const CreateScriptExecutionRequestSchema = ScriptExecutionRequestSchema.omit({ id: true, createdAt: true });
export type CreateScriptExecutionRequest = z.infer<typeof CreateScriptExecutionRequestSchema>;

export const ScriptExecutionResultSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the script execution result.'),
  requestId: z.string().uuid().describe('ID of the original script execution request.'),
  deviceId: z.string().uuid().describe('ID of the device on which the script was executed.'),
  status: ScriptExecutionStatus.describe('Status of the script execution on this specific device.'),
  output: z.string().optional().describe('Standard output from the script execution.'),
  error: z.string().optional().describe('Standard error from the script execution.'),
  exitCode: z.number().int().optional().describe('Exit code of the script process.'),
  startedAt: z.string().datetime().optional().describe('Timestamp when the script execution started on the device.'),
  completedAt: z.string().datetime().optional().describe('Timestamp when the script execution completed on the device.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the result was recorded.'),
});

export type ScriptExecutionResult = z.infer<typeof ScriptExecutionResultSchema>;

export const UpdateScriptExecutionResultSchema = ScriptExecutionResultSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateScriptExecutionResult = z.infer<typeof UpdateScriptExecutionResultSchema>;
