export interface OAuthStateToken {
  state: string;
  nonce: string;
  expiresAt: number;
}

export function isOAuthStateValid(token: OAuthStateToken, state: string, now = Date.now()): boolean {
  return token.state === state && token.expiresAt > now && token.nonce.length >= 12;
}
