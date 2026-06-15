export type PlanKey = 'free' | 'starter' | 'team' | 'business' | 'enterprise';
export type UsageMeterKey = 'remoteSessionMinutes' | 'fileTransferBytes' | 'teamMembers' | 'trustedDevices' | 'supportTickets';

export type PlanLimits = {
  readonly plan: PlanKey;
  readonly remoteSessionMinutesPerMonth: number;
  readonly fileTransferBytesPerMonth: number;
  readonly maxTeamMembers: number;
  readonly maxTrustedDevices: number;
  readonly prioritySupport: boolean;
};

export type UsageSnapshot = {
  readonly organizationId: string;
  readonly periodStartMs: number;
  readonly periodEndMs: number;
  readonly remoteSessionMinutes: number;
  readonly fileTransferBytes: number;
  readonly teamMembers: number;
  readonly trustedDevices: number;
  readonly supportTickets: number;
};

export type LimitDecision = { readonly allowed: true; readonly remaining: number } | { readonly allowed: false; readonly limit: number; readonly used: number; readonly reason: string };
