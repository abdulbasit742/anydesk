import type { ValidationEvidenceRecord, ValidationEvidenceRecordRepository } from "./validationEvidenceTypes.js";

export class ValidationEvidenceRecordService {
  constructor(private readonly repository: ValidationEvidenceRecordRepository) {}

  create(record: ValidationEvidenceRecord): Promise<ValidationEvidenceRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ValidationEvidenceRecord>): Promise<ValidationEvidenceRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("validationEvidence-not-found");
    return updated;
  }

  list(filter: Partial<ValidationEvidenceRecord> = {}, limit = 50): Promise<ValidationEvidenceRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
