export interface HostConsentRequestRecord {
  id: string; sessionId: string; requestedByUserId: string; consentType: string; state: 'pending' | 'accepted' | 'rejected' | 'expired'; createdAt: string;
}

export interface HostConsentRequestRecordRepository {
  create(record: HostConsentRequestRecord): Promise<HostConsentRequestRecord>;
  update(id: string, patch: Partial<HostConsentRequestRecord>): Promise<HostConsentRequestRecord | null>;
  list(filter: Partial<HostConsentRequestRecord>, limit: number): Promise<HostConsentRequestRecord[]>;
}
