import { z } from 'zod';

export const LogLevel = z.enum([
  'debug',
  'info',
  'warn',
  'error',
  'critical',
]);

export const LogEventSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the log event.'),
  timestamp: z.string().datetime().describe('Timestamp when the log event occurred.'),
  level: LogLevel.describe('Severity level of the log event.'),
  service: z.string().min(1).describe('Name of the service or application generating the log.'),
  message: z.string().min(1).describe('The log message.'),
  organizationId: z.string().uuid().optional().describe('ID of the organization related to the log event.'),
  sessionId: z.string().uuid().optional().describe('ID of the remote session related to the log event.'),
  userId: z.string().uuid().optional().describe('ID of the user related to the log event.'),
  deviceId: z.string().uuid().optional().describe('ID of the device related to the log event.'),
  metadata: z.record(z.any()).optional().describe('Additional structured data associated with the log event.'),
  traceId: z.string().optional().describe('Trace ID for distributed tracing.'),
  spanId: z.string().optional().describe('Span ID for distributed tracing.'),
});

export type LogEvent = z.infer<typeof LogEventSchema>;

export const CreateLogEventSchema = LogEventSchema.omit({ id: true, timestamp: true });
export type CreateLogEvent = z.infer<typeof CreateLogEventSchema>;
