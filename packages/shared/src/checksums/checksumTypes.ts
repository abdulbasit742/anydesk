export type ChecksumAlgorithm = 'crc32' | 'fnv1a32';
export type Checksum = { readonly algorithm: ChecksumAlgorithm; readonly value: string };
