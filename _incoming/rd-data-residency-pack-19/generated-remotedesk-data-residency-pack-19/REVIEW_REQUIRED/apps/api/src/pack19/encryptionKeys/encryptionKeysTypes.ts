export interface EncryptionKeyRecord {
  id: string; tenantId: string; region: string; keyAlias: string; status: 'active' | 'rotating' | 'retired' | 'disabled'; rotatedAt?: string;
}

export interface EncryptionKeyRecordRepository {
  create(record: EncryptionKeyRecord): Promise<EncryptionKeyRecord>;
  update(id: string, patch: Partial<EncryptionKeyRecord>): Promise<EncryptionKeyRecord | null>;
  list(filter: Partial<EncryptionKeyRecord>, limit: number): Promise<EncryptionKeyRecord[]>;
}
