import type { ChatModerationRecord, ChatModerationRecordRepository } from "./chatModerationTypes.js";

export class ChatModerationRecordService {
  constructor(private readonly repository: ChatModerationRecordRepository) {}

  create(record: ChatModerationRecord): Promise<ChatModerationRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ChatModerationRecord>): Promise<ChatModerationRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("chatModeration-not-found");
    return updated;
  }

  list(filter: Partial<ChatModerationRecord> = {}, limit = 50): Promise<ChatModerationRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
