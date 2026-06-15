export interface CollaborationStatus {
  activeViewers: number;
  pendingConsentRequests: number;
  annotationsEnabled: boolean;
}

export function collaborationNeedsAttention(status: CollaborationStatus): boolean {
  return status.pendingConsentRequests > 0 || status.activeViewers > 5;
}
