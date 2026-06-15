export interface KeyRotationJobRecord {
  id: string; tenantId: string; keyId: string; status: 'queued' | 'running' | 'completed' | 'failed'; createdAt: string; completedAt?: string;
}

export interface KeyRotationJobRecordRepository {
  create(record: KeyRotationJobRecord): Promise<KeyRotationJobRecord>;
  update(id: string, patch: Partial<KeyRotationJobRecord>): Promise<KeyRotationJobRecord | null>;
  list(filter: Partial<KeyRotationJobRecord>, limit: number): Promise<KeyRotationJobRecord[]>;
}
