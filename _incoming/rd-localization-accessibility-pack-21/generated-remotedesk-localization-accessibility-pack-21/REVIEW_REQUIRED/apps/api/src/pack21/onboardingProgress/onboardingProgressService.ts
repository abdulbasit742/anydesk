import type { OnboardingProgressRecord, OnboardingProgressRecordRepository } from "./onboardingProgressTypes.js";

export class OnboardingProgressRecordService {
  constructor(private readonly repository: OnboardingProgressRecordRepository) {}

  create(record: OnboardingProgressRecord): Promise<OnboardingProgressRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<OnboardingProgressRecord>): Promise<OnboardingProgressRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("onboardingProgress-not-found");
    return updated;
  }

  list(filter: Partial<OnboardingProgressRecord> = {}, limit = 50): Promise<OnboardingProgressRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
