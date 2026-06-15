import type { OAuthConnectionRecord, OAuthConnectionRecordRepository } from "./oauthConnectionsTypes.js";

export class OAuthConnectionRecordService {
  constructor(private readonly repository: OAuthConnectionRecordRepository) {}

  create(record: OAuthConnectionRecord): Promise<OAuthConnectionRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<OAuthConnectionRecord>): Promise<OAuthConnectionRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("oauthConnections-not-found");
    return updated;
  }

  list(filter: Partial<OAuthConnectionRecord> = {}, limit = 50): Promise<OAuthConnectionRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
