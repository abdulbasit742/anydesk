import { z } from 'zod';

export const SyncStatus = z.enum([
  'pending',
  'in_progress',
  'completed',
  'failed',
  'conflicted',
]);

export const OfflineDataChangeSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the data change record.'),
  entityType: z.string().min(1).describe('Type of entity being changed (e.g., session, device, user).'),
  entityId: z.string().uuid().describe('ID of the entity being changed.'),
  changeType: z.enum(['create', 'update', 'delete']).describe('Type of change operation.'),
  payload: z.record(z.any()).optional().describe('JSON payload of the change (for create/update).'),
  timestamp: z.string().datetime().describe('Timestamp when the change occurred on the device.'),
  deviceId: z.string().uuid().describe('ID of the device where the change originated.'),
});

export type OfflineDataChange = z.infer<typeof OfflineDataChangeSchema>;

export const OfflineSyncRequestSchema = z.object({
  deviceId: z.string().uuid().describe('ID of the device requesting synchronization.'),
  lastSyncTimestamp: z.string().datetime().optional().describe('Timestamp of the last successful synchronization.'),
  changes: z.array(OfflineDataChangeSchema).describe('List of data changes to synchronize from the device.'),
});

export type OfflineSyncRequest = z.infer<typeof OfflineSyncRequestSchema>;

export const OfflineSyncResponseSchema = z.object({
  deviceId: z.string().uuid().describe('ID of the device that initiated the synchronization.'),
  syncStatus: SyncStatus.describe('Overall status of the synchronization process.'),
  newLastSyncTimestamp: z.string().datetime().optional().describe('New timestamp to be used for the next synchronization.'),
  conflicts: z.array(OfflineDataChangeSchema).optional().describe('List of changes that resulted in conflicts.'),
  serverUpdates: z.array(z.record(z.any())).optional().describe('List of updates from the server to be applied to the device.'),
  errorMessage: z.string().optional().describe('Error message if synchronization failed.'),
});

export type OfflineSyncResponse = z.infer<typeof OfflineSyncResponseSchema>;
