import type { UsageMeterKey, UsageSnapshot } from './billingTypes.js';

export function incrementUsage(snapshot: UsageSnapshot, meter: UsageMeterKey, amount: number): UsageSnapshot {
  return { ...snapshot, [meter]: Math.max(0, snapshot[meter] + amount) };
}

export function emptyUsageSnapshot(organizationId: string, periodStartMs: number, periodEndMs: number): UsageSnapshot {
  return { organizationId, periodStartMs, periodEndMs, remoteSessionMinutes: 0, fileTransferBytes: 0, teamMembers: 0, trustedDevices: 0, supportTickets: 0 };
}
