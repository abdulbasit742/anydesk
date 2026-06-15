export interface PairingCode { code: string; expiresAt: string; maxAttempts: number; attempts: number; }
export function normalizePairingCode(code: string): string { return code.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 16); }
export function canUsePairingCode(pairing: PairingCode, now = new Date()): boolean { return normalizePairingCode(pairing.code).length >= 8 && new Date(pairing.expiresAt) > now && pairing.attempts < pairing.maxAttempts; }
