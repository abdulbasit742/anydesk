import {
  nextClipboardDebounceState,
  resolveClipboardConflict,
  shouldEmitClipboardSnapshot,
  type ClipboardDebounceState,
  type ClipboardSnapshot,
} from '@remotedesk/shared/clipboard';
import type { RemoteDeskDataChannelLike } from '../types/desktopPart2.js';

export type ClipboardChannelMessage =
  | { kind: 'clipboard.permission'; enabled: boolean; textOnly: true; htmlEnabled: false; sessionId: string }
  | { kind: 'clipboard.text'; sessionId: string; text: string; contentHash: string; sequence: number; sentAt: number }
  | { kind: 'clipboard.rejected'; sessionId: string; reason: string; sequence?: number };

export interface ClipboardChannelOptions {
  dataChannel: RemoteDeskDataChannelLike;
  sessionId: string;
  readText: () => Promise<{ text: string; changedAt: number }>;
  writeText: (input: { text: string; sourceSessionId: string }) => Promise<{ ok: true }>;
  onRemoteText?: (text: string) => void;
  onRejected?: (reason: string) => void;
  debounceMs?: number;
  maxTextLength?: number;
}

function hashText(text: string): string {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function snapshotFromText(input: { sessionId: string; text: string; sequence: number; capturedAtMs: number; origin: 'host' | 'viewer' }): ClipboardSnapshot {
  return {
    id: `clip_${input.sessionId}_${input.sequence}`,
    sessionId: input.sessionId,
    origin: input.origin,
    contentType: 'text/plain',
    text: input.text,
    contentHash: hashText(input.text),
    sequence: input.sequence,
    capturedAtMs: input.capturedAtMs,
  };
}

export class ClipboardChannel {
  private readonly options: ClipboardChannelOptions;
  private enabled = false;
  private sequence = 0;
  private debounceState: ClipboardDebounceState = {};
  private lastLocalSnapshot: ClipboardSnapshot | null = null;
  private pollTimer: number | undefined;

  private readonly onMessage = (event: MessageEvent): void => {
    if (typeof event.data !== 'string') return;
    let parsed: ClipboardChannelMessage | null = null;
    try { parsed = JSON.parse(event.data) as ClipboardChannelMessage; } catch { return; }
    if (!parsed.kind?.startsWith('clipboard.')) return;
    void this.handleMessage(parsed);
  };

  constructor(options: ClipboardChannelOptions) {
    this.options = { ...options, debounceMs: options.debounceMs ?? 500, maxTextLength: options.maxTextLength ?? 64_000 };
    this.options.dataChannel.addEventListener('message', this.onMessage);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.send({ kind: 'clipboard.permission', enabled, textOnly: true, htmlEnabled: false, sessionId: this.options.sessionId });
    if (enabled) this.startPolling();
    else this.stopPolling();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  private startPolling(): void {
    this.stopPolling();
    this.pollTimer = window.setInterval(() => void this.pollClipboard(), this.options.debounceMs);
  }

  private stopPolling(): void {
    if (this.pollTimer !== undefined) window.clearInterval(this.pollTimer);
    this.pollTimer = undefined;
  }

  private async pollClipboard(): Promise<void> {
    if (!this.enabled || this.options.dataChannel.readyState !== 'open') return;
    const local = await this.options.readText();
    if (!local.text) return;
    const snapshot = snapshotFromText({
      sessionId: this.options.sessionId,
      text: local.text,
      sequence: this.sequence + 1,
      capturedAtMs: local.changedAt,
      origin: 'host',
    });
    if (!shouldEmitClipboardSnapshot(this.debounceState, snapshot, this.options.debounceMs ?? 500)) return;
    this.sequence = snapshot.sequence;
    this.debounceState = nextClipboardDebounceState(this.debounceState, snapshot);
    this.lastLocalSnapshot = snapshot;
    this.sendText(local.text);
  }

  sendText(text: string): void {
    if (!this.enabled) return;
    if (text.length > (this.options.maxTextLength ?? 64_000)) {
      this.send({ kind: 'clipboard.rejected', sessionId: this.options.sessionId, reason: 'clipboard text exceeds limit' });
      return;
    }
    this.sequence += 1;
    const contentHash = hashText(text);
    this.send({ kind: 'clipboard.text', sessionId: this.options.sessionId, text, contentHash, sequence: this.sequence, sentAt: Date.now() });
  }

  private async handleMessage(message: ClipboardChannelMessage): Promise<void> {
    if (message.kind === 'clipboard.permission' && !message.enabled) return;
    if (message.kind === 'clipboard.rejected') {
      this.options.onRejected?.(message.reason);
      return;
    }
    if (message.kind !== 'clipboard.text' || !this.enabled) return;
    if (message.text.length > (this.options.maxTextLength ?? 64_000)) {
      this.send({ kind: 'clipboard.rejected', sessionId: this.options.sessionId, reason: 'remote clipboard text exceeds limit', sequence: message.sequence });
      return;
    }
    const incoming = snapshotFromText({
      sessionId: message.sessionId,
      text: message.text,
      sequence: message.sequence,
      capturedAtMs: message.sentAt,
      origin: 'viewer',
    });
    if (incoming.contentHash !== message.contentHash) {
      this.send({ kind: 'clipboard.rejected', sessionId: this.options.sessionId, reason: 'clipboard content hash mismatch', sequence: message.sequence });
      return;
    }
    const decision = resolveClipboardConflict(this.lastLocalSnapshot, incoming);
    if (decision.action !== 'apply') {
      this.send({ kind: 'clipboard.rejected', sessionId: this.options.sessionId, reason: decision.reason ?? 'conflict', sequence: message.sequence });
      return;
    }
    await this.options.writeText({ text: message.text, sourceSessionId: message.sessionId });
    this.lastLocalSnapshot = incoming;
    this.debounceState = nextClipboardDebounceState(this.debounceState, incoming);
    this.options.onRemoteText?.(message.text);
  }

  private send(message: ClipboardChannelMessage): void {
    if (this.options.dataChannel.readyState !== 'open') return;
    this.options.dataChannel.send(JSON.stringify(message));
  }

  dispose(): void {
    this.stopPolling();
    this.options.dataChannel.removeEventListener('message', this.onMessage);
  }
}
