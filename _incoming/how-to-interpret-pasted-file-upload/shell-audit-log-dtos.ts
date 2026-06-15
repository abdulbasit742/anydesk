import { z } from 'zod';

export const ShellCommandType = z.enum([
  'interactive',
  'scripted',
  'file_transfer',
  'other',
]);

export const ShellAuditLogSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the shell audit log entry.'),
  sessionId: z.string().uuid().describe('ID of the remote session where the command was executed.'),
  deviceId: z.string().uuid().describe('ID of the device where the command was executed.'),
  userId: z.string().uuid().describe('ID of the user who executed the command.'),
  timestamp: z.string().datetime().describe('Timestamp when the command was executed.'),
  command: z.string().min(1).describe('The command or script executed.'),
  commandType: ShellCommandType.describe('Type of command executed.'),
  output: z.string().optional().describe('Standard output from the command execution.'),
  error: z.string().optional().describe('Standard error from the command execution.'),
  exitCode: z.number().int().optional().describe('Exit code of the command process.'),
  durationMs: z.number().int().min(0).optional().describe('Duration of the command execution in milliseconds.'),
  ipAddress: z.string().ip().optional().describe('IP address from which the command was initiated.'),
  userAgent: z.string().optional().describe('User agent string of the client initiating the command.'),
  isSensitive: z.boolean().default(false).describe('Indicates if the command is considered sensitive.'),
  redactedCommand: z.string().optional().describe('Redacted version of the command if it contained sensitive information.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the log entry was created.'),
});

export type ShellAuditLog = z.infer<typeof ShellAuditLogSchema>;

export const CreateShellAuditLogSchema = ShellAuditLogSchema.omit({ id: true, createdAt: true });
export type CreateShellAuditLog = z.infer<typeof CreateShellAuditLogSchema>;

export const UpdateShellAuditLogSchema = ShellAuditLogSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateShellAuditLog = z.infer<typeof UpdateShellAuditLogSchema>;
