export type WebRtcSignalPayload = {
  readonly sessionId: string;
  readonly targetPeerId: string;
  readonly signal: unknown;
  readonly sentAtMs: number;
};

export type ActiveSessionSummary = {
  readonly sessionId: string;
  readonly organizationId: string;
  readonly hostDeviceId: string;
  readonly viewerUserId: string;
  readonly startedAtMs: number;
  readonly lastSeenAtMs: number;
  readonly remoteInputEnabled: boolean;
  readonly fileTransferEnabled: boolean;
  readonly clipboardSyncEnabled: boolean;
};
