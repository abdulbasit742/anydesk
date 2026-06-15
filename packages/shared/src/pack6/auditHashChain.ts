export interface AuditHashChainRecord {
  id: string;
  payloadHash: string;
  previousHash?: string;
}

export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function buildAuditPayloadHash(payload: unknown, previousHash?: string): Promise<string> {
  return sha256Hex(JSON.stringify({ payload, previousHash: previousHash ?? null }));
}

export function verifyAuditHashLink(record: AuditHashChainRecord, expectedPreviousHash?: string): boolean {
  return record.previousHash === expectedPreviousHash;
}
