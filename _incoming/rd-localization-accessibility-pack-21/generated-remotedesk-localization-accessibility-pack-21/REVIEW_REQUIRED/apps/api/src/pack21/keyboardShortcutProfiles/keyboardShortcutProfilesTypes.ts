export interface KeyboardShortcutProfileRecord {
  id: string; userId: string; profileName: string; shortcuts: Record<string, string>; updatedAt: string;
}

export interface KeyboardShortcutProfileRecordRepository {
  create(record: KeyboardShortcutProfileRecord): Promise<KeyboardShortcutProfileRecord>;
  update(id: string, patch: Partial<KeyboardShortcutProfileRecord>): Promise<KeyboardShortcutProfileRecord | null>;
  list(filter: Partial<KeyboardShortcutProfileRecord>, limit: number): Promise<KeyboardShortcutProfileRecord[]>;
}
