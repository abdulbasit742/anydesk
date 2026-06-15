import { TokenPair } from './types.js';

export function isTokenExpired(token: TokenPair, bufferSeconds = 60): boolean {
  return Date.now() >= token.expiresAt - bufferSeconds * 1000;
}

export function scheduleRefresh(token: TokenPair, cb: () => void, bufferSeconds = 60): number {
  const delay = Math.max(0, token.expiresAt - Date.now() - bufferSeconds * 1000);
  return window.setTimeout(cb, delay);
}

export function parseTokenPayload(token: string): { exp: number; sub: string; orgId?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return { exp: payload.exp * 1000, sub: payload.sub, orgId: payload.orgId };
  } catch {
    return null;
  }
}


