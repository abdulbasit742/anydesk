export interface KeyRotationPolicy {
  rotationDays: number;
  lastRotatedAt?: string;
  disabled: boolean;
}

export function keyRotationDue(policy: KeyRotationPolicy, now = new Date()): boolean {
  if (policy.disabled) return false;
  if (!policy.lastRotatedAt) return true;
  return now.getTime() - new Date(policy.lastRotatedAt).getTime() >= policy.rotationDays * 24 * 60 * 60 * 1000;
}
