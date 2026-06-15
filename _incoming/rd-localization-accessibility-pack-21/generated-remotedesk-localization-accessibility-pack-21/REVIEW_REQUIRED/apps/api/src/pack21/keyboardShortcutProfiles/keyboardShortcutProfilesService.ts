import type { KeyboardShortcutProfileRecord, KeyboardShortcutProfileRecordRepository } from "./keyboardShortcutProfilesTypes.js";

export class KeyboardShortcutProfileRecordService {
  constructor(private readonly repository: KeyboardShortcutProfileRecordRepository) {}

  create(record: KeyboardShortcutProfileRecord): Promise<KeyboardShortcutProfileRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<KeyboardShortcutProfileRecord>): Promise<KeyboardShortcutProfileRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("keyboardShortcutProfiles-not-found");
    return updated;
  }

  list(filter: Partial<KeyboardShortcutProfileRecord> = {}, limit = 50): Promise<KeyboardShortcutProfileRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
