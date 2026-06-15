import type { OnboardingTourRecord, OnboardingTourRecordRepository } from "./onboardingToursTypes.js";

export class OnboardingTourRecordService {
  constructor(private readonly repository: OnboardingTourRecordRepository) {}

  create(record: OnboardingTourRecord): Promise<OnboardingTourRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<OnboardingTourRecord>): Promise<OnboardingTourRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("onboardingTours-not-found");
    return updated;
  }

  list(filter: Partial<OnboardingTourRecord> = {}, limit = 50): Promise<OnboardingTourRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
