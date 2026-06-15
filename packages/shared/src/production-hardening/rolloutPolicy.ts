export interface RolloutPolicy {
  enabled: boolean;
  percentage: number;
  allowTeamIds?: readonly string[];
  blockTeamIds?: readonly string[];
}

export function isFeatureRolledOut(policy: RolloutPolicy, teamId: string): boolean {
  if (!policy.enabled) return false;
  if (policy.blockTeamIds?.includes(teamId)) return false;
  if (policy.allowTeamIds?.includes(teamId)) return true;
  const bucket = stableBucket(teamId);
  return bucket < Math.max(0, Math.min(100, policy.percentage));
}

export function stableBucket(value: string): number {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0) % 100;
}
