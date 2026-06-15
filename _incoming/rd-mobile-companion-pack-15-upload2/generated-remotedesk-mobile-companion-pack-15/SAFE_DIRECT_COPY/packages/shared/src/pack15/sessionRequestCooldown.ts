export interface SessionRequestCooldown { lastRequestedAt?: string; cooldownMs: number; }
export function canSendSessionRequest(input: SessionRequestCooldown, now = new Date()): boolean { if (!input.lastRequestedAt) return true; return now.getTime() - new Date(input.lastRequestedAt).getTime() >= input.cooldownMs; }
