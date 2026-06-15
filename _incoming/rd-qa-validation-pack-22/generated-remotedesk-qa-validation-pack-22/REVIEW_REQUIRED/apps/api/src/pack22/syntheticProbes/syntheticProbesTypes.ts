export interface SyntheticProbeRecord {
  id: string; key: string; kind: string; region: string; enabled: boolean; intervalSeconds: number;
}

export interface SyntheticProbeRecordRepository {
  create(record: SyntheticProbeRecord): Promise<SyntheticProbeRecord>;
  update(id: string, patch: Partial<SyntheticProbeRecord>): Promise<SyntheticProbeRecord | null>;
  list(filter: Partial<SyntheticProbeRecord>, limit: number): Promise<SyntheticProbeRecord[]>;
}
