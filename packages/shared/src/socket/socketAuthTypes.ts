export type SocketAuthContext = {
  readonly userId: string;
  readonly organizationId: string;
  readonly deviceId?: string;
  readonly sessionId?: string;
  readonly permissions: readonly string[];
};

export type SocketAuthResult = { readonly ok: true; readonly context: SocketAuthContext } | { readonly ok: false; readonly reason: 'missing-token' | 'invalid-token' | 'permission-denied' };
