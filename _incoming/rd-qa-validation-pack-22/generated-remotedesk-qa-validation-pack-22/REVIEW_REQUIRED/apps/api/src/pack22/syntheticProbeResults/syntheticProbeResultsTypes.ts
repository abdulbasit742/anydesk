export interface SyntheticProbeResultRecord {
  id: string; probeId: string; ok: boolean; latencyMs: number; checkedAt: string; error?: string;
}

export interface SyntheticProbeResultRecordRepository {
  create(record: SyntheticProbeResultRecord): Promise<SyntheticProbeResultRecord>;
  update(id: string, patch: Partial<SyntheticProbeResultRecord>): Promise<SyntheticProbeResultRecord | null>;
  list(filter: Partial<SyntheticProbeResultRecord>, limit: number): Promise<SyntheticProbeResultRecord[]>;
}
