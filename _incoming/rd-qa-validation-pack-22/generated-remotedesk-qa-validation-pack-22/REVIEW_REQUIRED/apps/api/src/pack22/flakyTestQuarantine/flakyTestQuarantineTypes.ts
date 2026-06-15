export interface FlakyTestQuarantineRecord {
  id: string; caseId: string; reason: string; quarantinedByUserId: string; expiresAt: string;
}

export interface FlakyTestQuarantineRecordRepository {
  create(record: FlakyTestQuarantineRecord): Promise<FlakyTestQuarantineRecord>;
  update(id: string, patch: Partial<FlakyTestQuarantineRecord>): Promise<FlakyTestQuarantineRecord | null>;
  list(filter: Partial<FlakyTestQuarantineRecord>, limit: number): Promise<FlakyTestQuarantineRecord[]>;
}
