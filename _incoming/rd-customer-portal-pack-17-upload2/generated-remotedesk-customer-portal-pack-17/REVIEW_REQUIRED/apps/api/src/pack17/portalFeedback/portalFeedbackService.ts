import type { PortalFeedbackRecord, PortalFeedbackRecordRepository } from "./portalFeedbackTypes.js";

export class PortalFeedbackRecordService {
  constructor(private readonly repository: PortalFeedbackRecordRepository) {}

  create(record: PortalFeedbackRecord): Promise<PortalFeedbackRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<PortalFeedbackRecord>): Promise<PortalFeedbackRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("portalFeedback-not-found");
    return updated;
  }

  list(filter: Partial<PortalFeedbackRecord> = {}, limit = 50): Promise<PortalFeedbackRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
