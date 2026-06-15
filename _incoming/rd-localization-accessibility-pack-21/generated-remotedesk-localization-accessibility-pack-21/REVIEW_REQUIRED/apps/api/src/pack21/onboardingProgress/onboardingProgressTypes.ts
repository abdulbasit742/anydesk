export interface OnboardingProgressRecord {
  id: string; userId: string; tourKey: string; completedStep: number; completedAt?: string; updatedAt: string;
}

export interface OnboardingProgressRecordRepository {
  create(record: OnboardingProgressRecord): Promise<OnboardingProgressRecord>;
  update(id: string, patch: Partial<OnboardingProgressRecord>): Promise<OnboardingProgressRecord | null>;
  list(filter: Partial<OnboardingProgressRecord>, limit: number): Promise<OnboardingProgressRecord[]>;
}
