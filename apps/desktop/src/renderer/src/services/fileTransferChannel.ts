import type { RemoteDeskDataChannelLike } from '../types/desktopPart2.js';

export type FileTransferChannelMessage =
  | { kind: 'file.offer'; transferId: string; fileName: string; size: number; mimeType?: string; checksum?: string; chunkSize: number; senderDeviceId?: string }
  | { kind: 'file.accept'; transferId: string; receiverDeviceId?: string }
  | { kind: 'file.reject'; transferId: string; reason: string }
  | { kind: 'file.chunk'; transferId: string; chunkIndex: number; offset: number; byteLength: number; checksum?: string; dataBase64: string }
  | { kind: 'file.ack'; transferId: string; chunkIndex: number; receivedBytes: number }
  | { kind: 'file.nack'; transferId: string; chunkIndex: number; reason: string; retryAfterMs?: number }
  | { kind: 'file.pause'; transferId: string; reason?: string }
  | { kind: 'file.resume'; transferId: string }
  | { kind: 'file.cancel'; transferId: string; reason?: string }
  | { kind: 'file.complete'; transferId: string; checksum?: string }
  | { kind: 'file.failed'; transferId: string; reason: string };

export type FileTransferChannelHandler = (message: FileTransferChannelMessage) => void;

export function isFileTransferMessage(value: unknown): value is FileTransferChannelMessage {
  if (typeof value !== 'object' || value === null || !('kind' in value)) return false;
  const kind = String((value as { kind: unknown }).kind);
  return kind.startsWith('file.');
}

export function parseFileTransferMessage(raw: string): FileTransferChannelMessage | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isFileTransferMessage(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export class FileTransferChannel {
  private readonly dataChannel: RemoteDeskDataChannelLike;
  private readonly handlers = new Set<FileTransferChannelHandler>();
  private readonly listener = (event: MessageEvent): void => {
    if (typeof event.data !== 'string') return;
    const message = parseFileTransferMessage(event.data);
    if (!message) return;
    for (const handler of this.handlers) handler(message);
  };

  constructor(dataChannel: RemoteDeskDataChannelLike) {
    this.dataChannel = dataChannel;
    this.dataChannel.addEventListener('message', this.listener);
  }

  ready(): boolean {
    return this.dataChannel.readyState === 'open';
  }

  send(message: FileTransferChannelMessage): void {
    if (!this.ready()) {
      throw new Error('file transfer data channel is not open');
    }
    this.dataChannel.send(JSON.stringify(message));
  }

  subscribe(handler: FileTransferChannelHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  dispose(): void {
    this.handlers.clear();
    this.dataChannel.removeEventListener('message', this.listener);
  }
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
