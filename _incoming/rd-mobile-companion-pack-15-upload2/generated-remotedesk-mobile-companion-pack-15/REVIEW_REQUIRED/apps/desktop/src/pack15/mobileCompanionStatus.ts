export interface MobileCompanionStatus { pairedDevices: number; pushEnabled: boolean; pendingApprovals: number; }
export function mobileCompanionNeedsAttention(status: MobileCompanionStatus): boolean { return status.pendingApprovals > 0 || (status.pairedDevices > 0 && !status.pushEnabled); }
