export type MobileApprovalState = 'pending' | 'approved' | 'rejected' | 'expired';
export function mobileApprovalIsFinal(state: MobileApprovalState): boolean { return state === 'approved' || state === 'rejected' || state === 'expired'; }
export function mobileApprovalAllowsSession(state: MobileApprovalState): boolean { return state === 'approved'; }
