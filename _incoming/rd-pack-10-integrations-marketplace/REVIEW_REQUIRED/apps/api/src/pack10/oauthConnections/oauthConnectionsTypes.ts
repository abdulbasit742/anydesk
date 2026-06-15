export interface OAuthConnectionRecord {
  id: string; teamId: string; connectorKey: string; subject: string; scopes: string[]; expiresAt?: string;
}

export interface OAuthConnectionRecordRepository {
  create(record: OAuthConnectionRecord): Promise<OAuthConnectionRecord>;
  update(id: string, patch: Partial<OAuthConnectionRecord>): Promise<OAuthConnectionRecord | null>;
  list(filter: Partial<OAuthConnectionRecord>, limit: number): Promise<OAuthConnectionRecord[]>;
}
