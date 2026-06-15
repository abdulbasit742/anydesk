import type { RetentionPolicyRecord, RetentionPolicyRecordRepository } from "./retentionPoliciesTypes.js";

export class RetentionPolicyRecordService {
  constructor(private readonly repository: RetentionPolicyRecordRepository) {}

  create(record: RetentionPolicyRecord): Promise<RetentionPolicyRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<RetentionPolicyRecord>): Promise<RetentionPolicyRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("retentionPolicies-not-found");
    return updated;
  }

  list(filter: Partial<RetentionPolicyRecord> = {}, limit = 50): Promise<RetentionPolicyRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
