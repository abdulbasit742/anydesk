export interface ViewerRosterRecord {
  id: string; sessionId: string; userId: string; role: 'host' | 'viewer' | 'support'; joinedAt: string; leftAt?: string; permissions: string[];
}

export interface ViewerRosterRecordRepository {
  create(record: ViewerRosterRecord): Promise<ViewerRosterRecord>;
  update(id: string, patch: Partial<ViewerRosterRecord>): Promise<ViewerRosterRecord | null>;
  list(filter: Partial<ViewerRosterRecord>, limit: number): Promise<ViewerRosterRecord[]>;
}
