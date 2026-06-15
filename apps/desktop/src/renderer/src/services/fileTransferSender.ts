import { crc32 } from '@remotedesk/shared/checksums/index.js';
import { calculateBackoffDelayMs } from '@remotedesk/shared/retry/index.js';
import { arrayBufferToBase64, type FileTransferChannel, type FileTransferChannelMessage } from './fileTransferChannel.js';

export interface FileTransferSenderOptions {
  channel: FileTransferChannel;
  readChunk: (input: { pathToken: string; offset: number; length: number }) => Promise<ArrayBuffer>;
  onProgress?: (input: { transferId: string; bytesSent: number; chunkIndex: number }) => void;
  onFailed?: (input: { transferId: string; error: string }) => void;
  maxRetriesPerChunk?: number;
}

export interface SendFileInput {
  transferId: string;
  fileName: string;
  size: number;
  mimeType?: string;
  pathToken: string;
  chunkSize: number;
  checksum?: string;
}

interface InFlightTransfer {
  input: SendFileInput;
  cancelled: boolean;
  paused: boolean;
  nextChunkIndex: number;
  retries: Map<number, number>;
  bytesSent: number;
}

export class FileTransferSender {
  private readonly channel: FileTransferChannel;
  private readonly readChunk: FileTransferSenderOptions['readChunk'];
  private readonly onProgress?: FileTransferSenderOptions['onProgress'];
  private readonly onFailed?: FileTransferSenderOptions['onFailed'];
  private readonly maxRetriesPerChunk: number;
  private readonly transfers = new Map<string, InFlightTransfer>();
  private unsubscribe?: () => void;

  constructor(options: FileTransferSenderOptions) {
    this.channel = options.channel;
    this.readChunk = options.readChunk;
    this.onProgress = options.onProgress;
    this.onFailed = options.onFailed;
    this.maxRetriesPerChunk = options.maxRetriesPerChunk ?? 5;
    this.unsubscribe = this.channel.subscribe((message) => this.handleMessage(message));
  }

  offer(input: SendFileInput): void {
    this.transfers.set(input.transferId, {
      input,
      cancelled: false,
      paused: false,
      nextChunkIndex: 0,
      retries: new Map(),
      bytesSent: 0,
    });
    this.channel.send({
      kind: 'file.offer',
      transferId: input.transferId,
      fileName: input.fileName,
      size: input.size,
      mimeType: input.mimeType,
      checksum: input.checksum,
      chunkSize: input.chunkSize,
    });
  }

  pause(transferId: string): void {
    const transfer = this.transfers.get(transferId);
    if (!transfer) return;
    transfer.paused = true;
    this.channel.send({ kind: 'file.pause', transferId, reason: 'sender paused' });
  }

  resume(transferId: string): void {
    const transfer = this.transfers.get(transferId);
    if (!transfer) return;
    transfer.paused = false;
    this.channel.send({ kind: 'file.resume', transferId });
    void this.sendNextChunk(transferId);
  }

  cancel(transferId: string, reason = 'sender cancelled'): void {
    const transfer = this.transfers.get(transferId);
    if (transfer) transfer.cancelled = true;
    this.transfers.delete(transferId);
    this.channel.send({ kind: 'file.cancel', transferId, reason });
  }

  private handleMessage(message: FileTransferChannelMessage): void {
    if (message.kind === 'file.accept') {
      void this.sendNextChunk(message.transferId);
    }
    if (message.kind === 'file.nack') {
      void this.retryChunk(message.transferId, message.chunkIndex, message.reason, message.retryAfterMs);
    }
    if (message.kind === 'file.ack') {
      const transfer = this.transfers.get(message.transferId);
      if (!transfer) return;
      transfer.bytesSent = Math.max(transfer.bytesSent, message.receivedBytes);
      transfer.nextChunkIndex = Math.max(transfer.nextChunkIndex, message.chunkIndex + 1);
      this.onProgress?.({ transferId: message.transferId, bytesSent: transfer.bytesSent, chunkIndex: message.chunkIndex });
      if (transfer.bytesSent >= transfer.input.size) {
        this.channel.send({ kind: 'file.complete', transferId: message.transferId, checksum: transfer.input.checksum });
        this.transfers.delete(message.transferId);
      } else {
        void this.sendNextChunk(message.transferId);
      }
    }
    if (message.kind === 'file.reject' || message.kind === 'file.cancel') {
      this.transfers.delete(message.transferId);
    }
  }

  private async retryChunk(transferId: string, chunkIndex: number, reason: string, retryAfterMs?: number): Promise<void> {
    const transfer = this.transfers.get(transferId);
    if (!transfer) return;
    const attempts = (transfer.retries.get(chunkIndex) ?? 0) + 1;
    transfer.retries.set(chunkIndex, attempts);
    if (attempts > this.maxRetriesPerChunk) {
      const error = `chunk ${chunkIndex} rejected too many times: ${reason}`;
      this.channel.send({ kind: 'file.failed', transferId, reason: error });
      this.onFailed?.({ transferId, error });
      this.transfers.delete(transferId);
      return;
    }
    const delay = retryAfterMs ?? calculateBackoffDelayMs(attempts, { baseDelayMs: 250, maxDelayMs: 4000, multiplier: 2, jitterRatio: 0.2 });
    await new Promise((resolve) => window.setTimeout(resolve, delay));
    transfer.nextChunkIndex = chunkIndex;
    await this.sendNextChunk(transferId);
  }

  private async sendNextChunk(transferId: string): Promise<void> {
    const transfer = this.transfers.get(transferId);
    if (!transfer || transfer.cancelled || transfer.paused) return;
    const { input } = transfer;
    const offset = transfer.nextChunkIndex * input.chunkSize;
    if (offset >= input.size) return;
    try {
      const length = Math.min(input.chunkSize, input.size - offset);
      const buffer = await this.readChunk({ pathToken: input.pathToken, offset, length });
      const checksum = crc32(new Uint8Array(buffer));
      this.channel.send({
        kind: 'file.chunk',
        transferId,
        chunkIndex: transfer.nextChunkIndex,
        offset,
        byteLength: buffer.byteLength,
        checksum,
        dataBase64: arrayBufferToBase64(buffer),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'failed to read file chunk';
      this.channel.send({ kind: 'file.failed', transferId, reason: message });
      this.onFailed?.({ transferId, error: message });
      this.transfers.delete(transferId);
    }
  }

  dispose(): void {
    this.unsubscribe?.();
    this.transfers.clear();
  }
}
