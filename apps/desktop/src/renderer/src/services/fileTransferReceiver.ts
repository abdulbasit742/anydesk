import { crc32 } from '@remotedesk/shared/checksums/index.js';
import { base64ToArrayBuffer, type FileTransferChannel, type FileTransferChannelMessage } from './fileTransferChannel.js';

export interface FileTransferReceiverOptions {
  channel: FileTransferChannel;
  writeChunk: (input: { pathToken: string; offset: number; bytes: ArrayBuffer }) => Promise<{ bytesWritten: number }>;
  finalizeFile: (input: { pathToken: string; expectedBytes: number }) => Promise<{ ok: true; bytesWritten: number }>;
  onOffer?: (offer: IncomingFileOffer) => void;
  onProgress?: (input: { transferId: string; receivedBytes: number; chunkIndex: number }) => void;
  onComplete?: (input: { transferId: string; checksum?: string }) => void;
  onFailed?: (input: { transferId: string; error: string }) => void;
}

export interface IncomingFileOffer {
  transferId: string;
  fileName: string;
  size: number;
  mimeType?: string;
  checksum?: string;
  chunkSize: number;
  senderDeviceId?: string;
}

interface ReceiveState {
  offer: IncomingFileOffer;
  saveTargetToken?: string;
  accepted: boolean;
  receivedBytes: number;
  nextChunkIndex: number;
}

export class FileTransferReceiver {
  private readonly channel: FileTransferChannel;
  private readonly writeChunk: FileTransferReceiverOptions['writeChunk'];
  private readonly finalizeFile: FileTransferReceiverOptions['finalizeFile'];
  private readonly onOffer?: FileTransferReceiverOptions['onOffer'];
  private readonly onProgress?: FileTransferReceiverOptions['onProgress'];
  private readonly onComplete?: FileTransferReceiverOptions['onComplete'];
  private readonly onFailed?: FileTransferReceiverOptions['onFailed'];
  private readonly transfers = new Map<string, ReceiveState>();
  private unsubscribe?: () => void;

  constructor(options: FileTransferReceiverOptions) {
    this.channel = options.channel;
    this.writeChunk = options.writeChunk;
    this.finalizeFile = options.finalizeFile;
    this.onOffer = options.onOffer;
    this.onProgress = options.onProgress;
    this.onComplete = options.onComplete;
    this.onFailed = options.onFailed;
    this.unsubscribe = this.channel.subscribe((message) => void this.handleMessage(message));
  }

  accept(transferId: string, saveTargetToken: string): void {
    const transfer = this.transfers.get(transferId);
    if (!transfer) throw new Error('unknown file transfer offer');
    transfer.accepted = true;
    transfer.saveTargetToken = saveTargetToken;
    this.channel.send({ kind: 'file.accept', transferId });
  }

  reject(transferId: string, reason: string): void {
    this.transfers.delete(transferId);
    this.channel.send({ kind: 'file.reject', transferId, reason });
  }

  private async handleMessage(message: FileTransferChannelMessage): Promise<void> {
    if (message.kind === 'file.offer') {
      const offer: IncomingFileOffer = { ...message };
      this.transfers.set(message.transferId, { offer, accepted: false, receivedBytes: 0, nextChunkIndex: 0 });
      this.onOffer?.(offer);
      return;
    }

    if (message.kind === 'file.chunk') {
      await this.handleChunk(message);
      return;
    }

    if (message.kind === 'file.complete') {
      await this.handleComplete(message.transferId, message.checksum);
      return;
    }

    if (message.kind === 'file.cancel' || message.kind === 'file.failed') {
      const reason = 'reason' in message ? message.reason : 'transfer cancelled';
      this.transfers.delete(message.transferId);
      this.onFailed?.({ transferId: message.transferId, error: reason ?? 'transfer cancelled' });
    }
  }

  private async handleChunk(message: Extract<FileTransferChannelMessage, { kind: 'file.chunk' }>): Promise<void> {
    const transfer = this.transfers.get(message.transferId);
    if (!transfer?.accepted || !transfer.saveTargetToken) {
      this.channel.send({ kind: 'file.nack', transferId: message.transferId, chunkIndex: message.chunkIndex, reason: 'transfer not accepted' });
      return;
    }
    if (message.chunkIndex !== transfer.nextChunkIndex) {
      this.channel.send({
        kind: 'file.nack',
        transferId: message.transferId,
        chunkIndex: message.chunkIndex,
        reason: `expected chunk ${transfer.nextChunkIndex}`,
        retryAfterMs: 250,
      });
      return;
    }
    try {
      const buffer = base64ToArrayBuffer(message.dataBase64);
      if (buffer.byteLength !== message.byteLength) {
        throw new Error('chunk byte length mismatch');
      }
      if (message.checksum && crc32(new Uint8Array(buffer)) !== message.checksum) {
        throw new Error('chunk checksum mismatch');
      }
      const result = await this.writeChunk({ pathToken: transfer.saveTargetToken, offset: message.offset, bytes: buffer });
      transfer.receivedBytes = Math.max(transfer.receivedBytes, message.offset + result.bytesWritten);
      transfer.nextChunkIndex = message.chunkIndex + 1;
      this.channel.send({ kind: 'file.ack', transferId: message.transferId, chunkIndex: message.chunkIndex, receivedBytes: transfer.receivedBytes });
      this.onProgress?.({ transferId: message.transferId, receivedBytes: transfer.receivedBytes, chunkIndex: message.chunkIndex });
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'failed to write chunk';
      this.channel.send({ kind: 'file.nack', transferId: message.transferId, chunkIndex: message.chunkIndex, reason });
    }
  }

  private async handleComplete(transferId: string, checksum?: string): Promise<void> {
    const transfer = this.transfers.get(transferId);
    if (!transfer?.saveTargetToken) return;
    try {
      await this.finalizeFile({ pathToken: transfer.saveTargetToken, expectedBytes: transfer.offer.size });
      this.transfers.delete(transferId);
      this.onComplete?.({ transferId, checksum });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'failed to finalize received file';
      this.onFailed?.({ transferId, error: message });
      this.channel.send({ kind: 'file.failed', transferId, reason: message });
    }
  }

  dispose(): void {
    this.unsubscribe?.();
    this.transfers.clear();
  }
}
