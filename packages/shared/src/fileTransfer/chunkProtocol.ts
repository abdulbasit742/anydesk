import { FILE_TRANSFER_CHUNK_SIZE_BYTES } from "./constants.js";

export interface FileTransferChunk {
  transferId: string;
  index: number;
  totalChunks: number;
  data: Uint8Array;
  checksum: string;
}

function checksumBytes(data: Uint8Array) {
  let hash = 5381;
  for (const byte of data) {
    hash = ((hash << 5) + hash) ^ byte;
    hash |= 0;
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function calculateTotalFileChunks(totalBytes: number, chunkSize = FILE_TRANSFER_CHUNK_SIZE_BYTES) {
  if (totalBytes <= 0) return 0;
  if (chunkSize <= 0) throw new RangeError("chunkSize must be greater than 0");
  return Math.ceil(totalBytes / chunkSize);
}

export function createFileTransferChunk(
  transferId: string,
  index: number,
  totalChunks: number,
  data: Uint8Array
): FileTransferChunk {
  return {
    transferId,
    index,
    totalChunks,
    data,
    checksum: checksumBytes(data)
  };
}

export function verifyFileTransferChunk(chunk: FileTransferChunk) {
  return checksumBytes(chunk.data) === chunk.checksum;
}
