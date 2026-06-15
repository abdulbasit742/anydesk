import type { ToastSink } from '../types/desktopPart2.js';
import type { FileTransferItem } from '../features/fileTransfer/fileTransferStore.js';

export function notifyTransferCompleted(toast: ToastSink | undefined, item: FileTransferItem): void {
  toast?.success(`${item.fileName} transfer completed`);
}

export function notifyTransferFailed(toast: ToastSink | undefined, item: FileTransferItem, error: string): void {
  toast?.error(`${item.fileName} transfer failed: ${error}`);
}

export function notifyTransferOffered(toast: ToastSink | undefined, item: FileTransferItem): void {
  toast?.info(`Incoming file offer: ${item.fileName}`);
}

export function notifyTransferWarning(toast: ToastSink | undefined, message: string): void {
  toast?.warning(message);
}
