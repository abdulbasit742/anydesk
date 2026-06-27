export interface CreateBackupDto { deviceId: string; type: "full" | "incremental" | "differential"; compress?: boolean; encrypt?: boolean; excludePaths?: string[]; destination?: "local" | "s3" | "azure" | "gcs"; retentionDays?: number; }
export interface ScheduleBackupDto { deviceId: string; cron: string; type: "full" | "incremental"; retentionDays: number; }
