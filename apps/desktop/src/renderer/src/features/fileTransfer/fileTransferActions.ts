import type { FileTransferItem } from './fileTransferStore.js';

export function canPauseTransfer(item: FileTransferItem): boolean {
  return item.status === 'queued' || item.status === 'transferring';
}

export function canResumeTransfer(item: FileTransferItem): boolean {
  return item.status === 'paused';
}

export function canCancelTransfer(item: FileTransferItem): boolean {
  return ['offered', 'waiting-for-acceptance', 'accepted', 'queued', 'transferring', 'paused', 'verifying'].includes(item.status);
}

export function isTerminalTransferStatus(status: FileTransferItem['status']): boolean {
  return ['completed', 'rejected', 'cancelled', 'failed'].includes(status);
}

export function describeTransferStatus(item: FileTransferItem): string {
  switch (item.status) {
    case 'offered': return 'Incoming offer awaiting response';
    case 'waiting-for-acceptance': return 'Waiting for recipient to accept';
    case 'accepted': return 'Accepted';
    case 'queued': return 'Queued';
    case 'transferring': return 'Transferring';
    case 'paused': return 'Paused';
    case 'verifying': return 'Verifying checksum';
    case 'completed': return 'Completed';
    case 'rejected': return 'Rejected';
    case 'cancelled': return 'Cancelled';
    case 'failed': return 'Failed';
    default: return item.status;
  }
}
