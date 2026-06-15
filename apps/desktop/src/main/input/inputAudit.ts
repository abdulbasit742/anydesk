import type { NormalizedInputEvent } from './inputExecutor.js';

export interface InputAuditSink {
  emit(event: { type: string; sessionId: string; reason?: string; inputType?: NormalizedInputEvent['type']; at: string }): void | Promise<void>;
}

export function emitInputEnabled(sink: InputAuditSink | undefined, sessionId: string): void {
  void sink?.emit({ type: 'remote_input.enabled', sessionId, at: new Date().toISOString() });
}

export function emitInputDisabled(sink: InputAuditSink | undefined, sessionId: string, reason: string): void {
  void sink?.emit({ type: 'remote_input.disabled', sessionId, reason, at: new Date().toISOString() });
}

export function emitInputBlocked(sink: InputAuditSink | undefined, sessionId: string, reason: string, event?: NormalizedInputEvent): void {
  void sink?.emit({ type: 'remote_input.blocked', sessionId, reason, inputType: event?.type, at: new Date().toISOString() });
}
