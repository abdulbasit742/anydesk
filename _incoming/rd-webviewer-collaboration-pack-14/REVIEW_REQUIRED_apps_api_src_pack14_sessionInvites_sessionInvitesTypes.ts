export interface SessionInviteRecord {
  id: string; sessionId: string; invitedEmailHash?: string; expiresAt: string; maxUses: number; used: number; createdByUserId: string;
}

export interface SessionInviteRecordRepository {
  create(record: SessionInviteRecord): Promise<SessionInviteRecord>;
  update(id: string, patch: Partial<SessionInviteRecord>): Promise<SessionInviteRecord | null>;
  list(filter: Partial<SessionInviteRecord>, limit: number): Promise<SessionInviteRecord[]>;
}
