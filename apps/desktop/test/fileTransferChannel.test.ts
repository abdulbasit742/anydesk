import { describe, expect, it } from 'vitest';
import { arrayBufferToBase64, base64ToArrayBuffer, parseFileTransferMessage } from '../src/renderer/src/services/fileTransferChannel.js';

describe('fileTransferChannel helpers', () => {
  it('parses only file transfer messages', () => {
    expect(parseFileTransferMessage(JSON.stringify({ kind: 'file.ack', transferId: 't', chunkIndex: 1, receivedBytes: 10 }))).toMatchObject({ kind: 'file.ack' });
    expect(parseFileTransferMessage(JSON.stringify({ kind: 'chat.message', text: 'no' }))).toBeNull();
  });

  it('round-trips base64 chunks', () => {
    const bytes = new Uint8Array([1, 2, 3, 255]);
    const encoded = arrayBufferToBase64(bytes.buffer);
    expect([...new Uint8Array(base64ToArrayBuffer(encoded))]).toEqual([1, 2, 3, 255]);
  });
});
