import type { Checksum, ChecksumAlgorithm } from './checksumTypes.js';
import { crc32 } from './crc32.js';
import { fnv1a32 } from './fnv1a.js';

export function createChecksum(bytes: Uint8Array, algorithm: ChecksumAlgorithm = 'crc32'): Checksum {
  return { algorithm, value: algorithm === 'crc32' ? crc32(bytes) : fnv1a32(bytes) };
}

export function verifyChecksum(bytes: Uint8Array, expected: Checksum): boolean {
  return createChecksum(bytes, expected.algorithm).value === expected.value;
}

export function combineChecksumValues(parts: readonly Checksum[], algorithm: ChecksumAlgorithm = 'fnv1a32'): Checksum {
  const encoded = new TextEncoder().encode(parts.map((part) => `${part.algorithm}:${part.value}`).join('|'));
  return createChecksum(encoded, algorithm);
}
