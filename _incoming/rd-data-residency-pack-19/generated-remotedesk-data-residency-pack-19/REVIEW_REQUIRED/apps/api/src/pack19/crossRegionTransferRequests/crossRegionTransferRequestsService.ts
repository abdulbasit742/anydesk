import type { CrossRegionTransferRequestRecord, CrossRegionTransferRequestRecordRepository } from "./crossRegionTransferRequestsTypes.js";

export class CrossRegionTransferRequestRecordService {
  constructor(private readonly repository: CrossRegionTransferRequestRecordRepository) {}

  create(record: CrossRegionTransferRequestRecord): Promise<CrossRegionTransferRequestRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<CrossRegionTransferRequestRecord>): Promise<CrossRegionTransferRequestRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("crossRegionTransferRequests-not-found");
    return updated;
  }

  list(filter: Partial<CrossRegionTransferRequestRecord> = {}, limit = 50): Promise<CrossRegionTransferRequestRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
