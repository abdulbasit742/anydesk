import { MAX_CLIPBOARD_TEXT_SIZE_BYTES } from "./constants.js";
import type {
  ClipboardConflictDecision,
  ClipboardDebounceState,
  ClipboardMessage,
  ClipboardPermissionState,
  ClipboardSnapshot
} from "./types.js";

export function getUtf8ByteLength(value: string) {
  return new TextEncoder().encode(value).length;
}

export function isClipboardTextWithinLimit(text: string) {
  return getUtf8ByteLength(text) <= MAX_CLIPBOARD_TEXT_SIZE_BYTES;
}

export function canSyncClipboard(state: ClipboardPermissionState) {
  return state === "enabled";
}

export function isDuplicateClipboardMessage(current: ClipboardMessage, previous: ClipboardMessage | null) {
  if (!previous) return false;
  return current.payload.text === previous.payload.text && current.payload.sourcePeerId === previous.payload.sourcePeerId;
}

export function chooseLatestClipboardMessage(a: ClipboardMessage, b: ClipboardMessage) {
  return a.payload.copiedAt >= b.payload.copiedAt ? a : b;
}

export function hashClipboardText(text: string) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function isClipboardSnapshotWithinLimit(snapshot: ClipboardSnapshot) {
  return snapshot.contentType === "text/plain" && isClipboardTextWithinLimit(snapshot.text);
}

export function shouldEmitClipboardSnapshot(
  state: ClipboardDebounceState,
  snapshot: ClipboardSnapshot,
  debounceMs: number
) {
  if (!isClipboardSnapshotWithinLimit(snapshot)) return false;
  if (state.lastSnapshot?.contentHash === snapshot.contentHash) return false;
  if (state.lastEmittedAtMs && snapshot.capturedAtMs - state.lastEmittedAtMs < debounceMs) return false;
  return true;
}

export function nextClipboardDebounceState(
  state: ClipboardDebounceState,
  snapshot: ClipboardSnapshot
): ClipboardDebounceState {
  return {
    ...state,
    lastSnapshot: snapshot,
    lastEmittedAtMs: snapshot.capturedAtMs
  };
}

export function resolveClipboardConflict(
  local: ClipboardSnapshot | null,
  remote: ClipboardSnapshot
): ClipboardConflictDecision {
  if (!isClipboardSnapshotWithinLimit(remote)) {
    return { action: "reject", reason: "remote clipboard text exceeds limit" };
  }

  if (!local) return { action: "apply" };

  if (local.contentHash === remote.contentHash) {
    return { action: "reject", reason: "duplicate clipboard text" };
  }

  if (local.capturedAtMs > remote.capturedAtMs) {
    return { action: "reject", reason: "local clipboard is newer" };
  }

  return { action: "apply" };
}
