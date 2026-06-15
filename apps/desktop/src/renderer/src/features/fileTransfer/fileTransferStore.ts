import { calculateBytesPerSecond, estimateRemainingMs, type TransferRateSample } from './fileTransferCalculations.js';

export type FileTransferDirection = 'send' | 'receive';
export type FileTransferStatus =
  | 'offered'
  | 'waiting-for-acceptance'
  | 'accepted'
  | 'queued'
  | 'transferring'
  | 'paused'
  | 'verifying'
  | 'completed'
  | 'rejected'
  | 'cancelled'
  | 'failed';

export interface FileTransferItem {
  id: string;
  direction: FileTransferDirection;
  fileName: string;
  size: number;
  mimeType?: string;
  peerDeviceId?: string;
  status: FileTransferStatus;
  transferredBytes: number;
  checksum?: string;
  error?: string;
  warning?: string;
  createdAt: number;
  updatedAt: number;
  acceptedAt?: number;
  completedAt?: number;
  saveTargetToken?: string;
  sourcePathToken?: string;
  chunkSize: number;
  nextChunkIndex: number;
  rateSamples: TransferRateSample[];
  bytesPerSecond: number;
  estimatedRemainingMs: number | null;
}

export interface FileTransferState {
  enabled: boolean;
  items: Record<string, FileTransferItem>;
  order: string[];
  activeTransferId?: string;
}

export type FileTransferAction =
  | { type: 'set-enabled'; enabled: boolean; now?: number }
  | { type: 'offer-created'; item: FileTransferItem }
  | { type: 'offer-received'; item: FileTransferItem }
  | { type: 'accepted'; id: string; saveTargetToken?: string; now?: number }
  | { type: 'rejected'; id: string; reason?: string; now?: number }
  | { type: 'queued'; id: string; now?: number }
  | { type: 'started'; id: string; now?: number }
  | { type: 'progress'; id: string; bytes: number; chunkIndex?: number; now?: number }
  | { type: 'paused'; id: string; now?: number }
  | { type: 'resumed'; id: string; now?: number }
  | { type: 'verifying'; id: string; now?: number }
  | { type: 'completed'; id: string; checksum?: string; now?: number }
  | { type: 'cancelled'; id: string; reason?: string; now?: number }
  | { type: 'failed'; id: string; error: string; now?: number }
  | { type: 'clear-terminal' };

export const initialFileTransferState: FileTransferState = {
  enabled: false,
  items: {},
  order: [],
};

export function createFileTransferItem(input: Omit<FileTransferItem, 'status' | 'transferredBytes' | 'createdAt' | 'updatedAt' | 'nextChunkIndex' | 'rateSamples' | 'bytesPerSecond' | 'estimatedRemainingMs'> & { status?: FileTransferStatus; now?: number }): FileTransferItem {
  const now = input.now ?? Date.now();
  return {
    ...input,
    status: input.status ?? 'offered',
    transferredBytes: 0,
    createdAt: now,
    updatedAt: now,
    nextChunkIndex: 0,
    rateSamples: [{ at: now, bytes: 0 }],
    bytesPerSecond: 0,
    estimatedRemainingMs: null,
  };
}

function putItem(state: FileTransferState, item: FileTransferItem): FileTransferState {
  const exists = Boolean(state.items[item.id]);
  return {
    ...state,
    items: { ...state.items, [item.id]: item },
    order: exists ? state.order : [item.id, ...state.order],
  };
}

function updateItem(
  state: FileTransferState,
  id: string,
  updater: (item: FileTransferItem) => FileTransferItem,
): FileTransferState {
  const current = state.items[id];
  if (!current) return state;
  return putItem(state, updater(current));
}

export function fileTransferReducer(
  state: FileTransferState = initialFileTransferState,
  action: FileTransferAction,
): FileTransferState {
  const now = 'now' in action && action.now ? action.now : Date.now();
  switch (action.type) {
    case 'set-enabled':
      return { ...state, enabled: action.enabled };
    case 'offer-created':
    case 'offer-received':
      return putItem(state, action.item);
    case 'accepted':
      return updateItem(state, action.id, (item) => ({
        ...item,
        status: 'accepted',
        acceptedAt: now,
        updatedAt: now,
        saveTargetToken: action.saveTargetToken ?? item.saveTargetToken,
      }));
    case 'rejected':
      return updateItem(state, action.id, (item) => ({ ...item, status: 'rejected', error: action.reason, updatedAt: now }));
    case 'queued':
      return updateItem(state, action.id, (item) => ({ ...item, status: 'queued', updatedAt: now }));
    case 'started':
      return updateItem({ ...state, activeTransferId: action.id }, action.id, (item) => ({ ...item, status: 'transferring', updatedAt: now }));
    case 'progress':
      return updateItem(state, action.id, (item) => {
        const transferredBytes = Math.min(item.size, Math.max(item.transferredBytes, action.bytes));
        const rateSamples = [...item.rateSamples, { at: now, bytes: transferredBytes }].filter((sample) => now - sample.at <= 15000);
        const bytesPerSecond = calculateBytesPerSecond(rateSamples, now);
        return {
          ...item,
          transferredBytes,
          nextChunkIndex: action.chunkIndex != null ? Math.max(item.nextChunkIndex, action.chunkIndex + 1) : item.nextChunkIndex,
          rateSamples,
          bytesPerSecond,
          estimatedRemainingMs: estimateRemainingMs(item.size, transferredBytes, bytesPerSecond),
          updatedAt: now,
        };
      });
    case 'paused':
      return updateItem(state, action.id, (item) => ({ ...item, status: 'paused', updatedAt: now }));
    case 'resumed':
      return updateItem(state, action.id, (item) => ({ ...item, status: 'queued', updatedAt: now }));
    case 'verifying':
      return updateItem(state, action.id, (item) => ({ ...item, status: 'verifying', updatedAt: now }));
    case 'completed':
      return updateItem({ ...state, activeTransferId: state.activeTransferId === action.id ? undefined : state.activeTransferId }, action.id, (item) => ({
        ...item,
        status: 'completed',
        transferredBytes: item.size,
        checksum: action.checksum ?? item.checksum,
        completedAt: now,
        updatedAt: now,
        estimatedRemainingMs: 0,
      }));
    case 'cancelled':
      return updateItem({ ...state, activeTransferId: state.activeTransferId === action.id ? undefined : state.activeTransferId }, action.id, (item) => ({
        ...item,
        status: 'cancelled',
        error: action.reason,
        updatedAt: now,
      }));
    case 'failed':
      return updateItem({ ...state, activeTransferId: state.activeTransferId === action.id ? undefined : state.activeTransferId }, action.id, (item) => ({
        ...item,
        status: 'failed',
        error: action.error,
        updatedAt: now,
      }));
    case 'clear-terminal': {
      const keep = state.order.filter((id) => {
        const status = state.items[id]?.status;
        return !status || !['completed', 'failed', 'cancelled', 'rejected'].includes(status);
      });
      const items = Object.fromEntries(keep.map((id) => [id, state.items[id]]));
      return { ...state, order: keep, items };
    }
    default:
      return state;
  }
}

export function selectFileTransferItems(state: FileTransferState): FileTransferItem[] {
  return state.order.map((id) => state.items[id]).filter(Boolean);
}
