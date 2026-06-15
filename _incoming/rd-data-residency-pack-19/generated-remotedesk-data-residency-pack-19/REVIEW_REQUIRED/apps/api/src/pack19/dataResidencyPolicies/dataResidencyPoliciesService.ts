import type { DataResidencyPolicyRecord, DataResidencyPolicyRecordRepository } from "./dataResidencyPoliciesTypes.js";

export class DataResidencyPolicyRecordService {
  constructor(private readonly repository: DataResidencyPolicyRecordRepository) {}

  create(record: DataResidencyPolicyRecord): Promise<DataResidencyPolicyRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<DataResidencyPolicyRecord>): Promise<DataResidencyPolicyRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("dataResidencyPolicies-not-found");
    return updated;
  }

  list(filter: Partial<DataResidencyPolicyRecord> = {}, limit = 50): Promise<DataResidencyPolicyRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
