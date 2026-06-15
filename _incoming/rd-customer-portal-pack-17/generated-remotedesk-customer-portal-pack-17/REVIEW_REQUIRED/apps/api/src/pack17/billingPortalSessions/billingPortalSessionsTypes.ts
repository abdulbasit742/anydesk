export interface BillingPortalSessionRecord {
  id: string; teamId: string; userId: string; expiresAt: string; createdAt: string;
}

export interface BillingPortalSessionRecordRepository {
  create(record: BillingPortalSessionRecord): Promise<BillingPortalSessionRecord>;
  update(id: string, patch: Partial<BillingPortalSessionRecord>): Promise<BillingPortalSessionRecord | null>;
  list(filter: Partial<BillingPortalSessionRecord>, limit: number): Promise<BillingPortalSessionRecord[]>;
}
