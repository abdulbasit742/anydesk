export interface OnboardingTourRecord {
  id: string; key: string; title: string; enabled: boolean; steps: string[]; updatedAt: string;
}

export interface OnboardingTourRecordRepository {
  create(record: OnboardingTourRecord): Promise<OnboardingTourRecord>;
  update(id: string, patch: Partial<OnboardingTourRecord>): Promise<OnboardingTourRecord | null>;
  list(filter: Partial<OnboardingTourRecord>, limit: number): Promise<OnboardingTourRecord[]>;
}
