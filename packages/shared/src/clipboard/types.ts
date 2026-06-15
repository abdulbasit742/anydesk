export type ClipboardPermissionState = "disabled" | "local-enabled" | "remote-enabled" | "enabled";

export interface ClipboardTextPayload {
  text: string;
  copiedAt: number;
  sourcePeerId: string;
}

export interface ClipboardMessage {
  type: "clipboard:text";
  payload: ClipboardTextPayload;
}

export type ClipboardOrigin = "host" | "viewer";

export interface ClipboardSnapshot {
  id: string;
  sessionId: string;
  origin: ClipboardOrigin;
  contentType: "text/plain";
  text: string;
  contentHash: string;
  sequence: number;
  capturedAtMs: number;
}

export interface ClipboardDebounceState {
  lastSnapshot?: ClipboardSnapshot;
  lastEmittedAtMs?: number;
}

export interface ClipboardConflictDecision {
  action: "apply" | "reject";
  reason?: string;
}
