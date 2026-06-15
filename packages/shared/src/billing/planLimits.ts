import type { LimitDecision, PlanKey, PlanLimits, UsageMeterKey, UsageSnapshot } from './billingTypes.js';

export const DEFAULT_PLAN_LIMITS: Record<PlanKey, PlanLimits> = {
  free: { plan: 'free', remoteSessionMinutesPerMonth: 120, fileTransferBytesPerMonth: 250 * 1024 * 1024, maxTeamMembers: 1, maxTrustedDevices: 1, prioritySupport: false },
  starter: { plan: 'starter', remoteSessionMinutesPerMonth: 1000, fileTransferBytesPerMonth: 10 * 1024 * 1024 * 1024, maxTeamMembers: 3, maxTrustedDevices: 5, prioritySupport: false },
  team: { plan: 'team', remoteSessionMinutesPerMonth: 6000, fileTransferBytesPerMonth: 100 * 1024 * 1024 * 1024, maxTeamMembers: 15, maxTrustedDevices: 50, prioritySupport: true },
  business: { plan: 'business', remoteSessionMinutesPerMonth: 30000, fileTransferBytesPerMonth: 1024 * 1024 * 1024 * 1024, maxTeamMembers: 100, maxTrustedDevices: 500, prioritySupport: true },
  enterprise: { plan: 'enterprise', remoteSessionMinutesPerMonth: Number.POSITIVE_INFINITY, fileTransferBytesPerMonth: Number.POSITIVE_INFINITY, maxTeamMembers: Number.POSITIVE_INFINITY, maxTrustedDevices: Number.POSITIVE_INFINITY, prioritySupport: true },
};

function usedFor(snapshot: UsageSnapshot, meter: UsageMeterKey): number {
  return snapshot[meter];
}

function limitFor(limits: PlanLimits, meter: UsageMeterKey): number {
  switch (meter) {
    case 'remoteSessionMinutes': return limits.remoteSessionMinutesPerMonth;
    case 'fileTransferBytes': return limits.fileTransferBytesPerMonth;
    case 'teamMembers': return limits.maxTeamMembers;
    case 'trustedDevices': return limits.maxTrustedDevices;
    case 'supportTickets': return Number.POSITIVE_INFINITY;
  }
}

export function enforcePlanLimit(limits: PlanLimits, snapshot: UsageSnapshot, meter: UsageMeterKey, increment = 1): LimitDecision {
  const used = usedFor(snapshot, meter);
  const limit = limitFor(limits, meter);
  if (used + increment > limit) return { allowed: false, limit, used, reason: `${meter} limit exceeded for ${limits.plan}` };
  return { allowed: true, remaining: limit === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : limit - used - increment };
}
