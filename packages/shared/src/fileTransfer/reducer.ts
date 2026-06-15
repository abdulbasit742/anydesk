import type { FileMetadata, FileTransferAction, FileTransferState } from "./types.js";

export function createPendingTransfer(id: string, metadata: FileMetadata, now = Date.now()): FileTransferState {
  return {
    id,
    metadata,
    status: "pending",
    totalBytes: Math.max(0, metadata.size),
    transferredBytes: 0,
    startedAt: null,
    updatedAt: now,
    endedAt: null,
    error: null
  };
}

export function reduceFileTransfer(state: FileTransferState, action: FileTransferAction): FileTransferState {
  const at = action.at ?? Date.now();

  if (state.status === "cancelled" || state.status === "completed" || state.status === "failed") {
    return state;
  }

  switch (action.type) {
    case "accept":
      return { ...state, status: "in-progress", startedAt: state.startedAt ?? at, updatedAt: at };
    case "reject":
      return { ...state, status: "failed", error: action.reason, updatedAt: at, endedAt: at };
    case "chunk": {
      if (state.status !== "in-progress") return state;
      const transferredBytes = Math.min(state.totalBytes, state.transferredBytes + Math.max(0, action.bytes));
      const completed = transferredBytes >= state.totalBytes;
      return {
        ...state,
        transferredBytes,
        status: completed ? "completed" : state.status,
        updatedAt: at,
        endedAt: completed ? at : state.endedAt
      };
    }
    case "pause":
      return state.status === "in-progress" ? { ...state, status: "paused", updatedAt: at } : state;
    case "resume":
      return state.status === "paused" ? { ...state, status: "in-progress", updatedAt: at } : state;
    case "cancel":
      return { ...state, status: "cancelled", error: action.reason ?? null, updatedAt: at, endedAt: at };
    case "fail":
      return { ...state, status: "failed", error: action.error, updatedAt: at, endedAt: at };
    case "complete":
      return { ...state, status: "completed", transferredBytes: state.totalBytes, updatedAt: at, endedAt: at };
    default:
      return state;
  }
}
