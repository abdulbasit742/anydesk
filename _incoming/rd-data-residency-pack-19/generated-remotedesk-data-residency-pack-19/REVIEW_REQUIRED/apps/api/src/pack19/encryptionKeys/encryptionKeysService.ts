import type { EncryptionKeyRecord, EncryptionKeyRecordRepository } from "./encryptionKeysTypes.js";

export class EncryptionKeyRecordService {
  constructor(private readonly repository: EncryptionKeyRecordRepository) {}

  create(record: EncryptionKeyRecord): Promise<EncryptionKeyRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<EncryptionKeyRecord>): Promise<EncryptionKeyRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("encryptionKeys-not-found");
    return updated;
  }

  list(filter: Partial<EncryptionKeyRecord> = {}, limit = 50): Promise<EncryptionKeyRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
