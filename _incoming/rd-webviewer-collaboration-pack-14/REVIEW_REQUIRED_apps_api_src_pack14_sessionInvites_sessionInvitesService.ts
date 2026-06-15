import type { SessionInviteRecord, SessionInviteRecordRepository } from "./sessionInvitesTypes.js";

export class SessionInviteRecordService {
  constructor(private readonly repository: SessionInviteRecordRepository) {}

  create(record: SessionInviteRecord): Promise<SessionInviteRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SessionInviteRecord>): Promise<SessionInviteRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("sessionInvites-not-found");
    return updated;
  }

  list(filter: Partial<SessionInviteRecord> = {}, limit = 50): Promise<SessionInviteRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
