import type { ConnectorAuditRecord, ConnectorAuditRecordRepository } from "./connectorAuditTypes.js";

export class ConnectorAuditRecordService {
  constructor(private readonly repository: ConnectorAuditRecordRepository) {}

  create(record: ConnectorAuditRecord): Promise<ConnectorAuditRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ConnectorAuditRecord>): Promise<ConnectorAuditRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("connectorAudit-not-found");
    return updated;
  }

  list(filter: Partial<ConnectorAuditRecord> = {}, limit = 50): Promise<ConnectorAuditRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
