export interface SessionInviteToken {
  id: string;
  sessionId: string;
  expiresAt: string;
  maxUses: number;
  used: number;
}

export function canUseSessionInvite(token: SessionInviteToken, now = new Date()): boolean {
  return new Date(token.expiresAt) > now && token.used < token.maxUses;
}
