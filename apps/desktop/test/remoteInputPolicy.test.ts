import { describe, expect, it } from 'vitest';
import {
  createBlockedKeyPolicy,
  createRemoteInputBatcher,
  shouldForwardKeyboardEvent,
  type RemoteInputMessage
} from '../src/renderer/src/services/remoteInput.js';

function keyMessage(code: string): RemoteInputMessage {
  return {
    type: 'key-down',
    key: code,
    code,
    ctrl: false,
    alt: false,
    shift: false,
    meta: false,
    timestamp: 1
  };
}

describe('remote input keyboard policy', () => {
  it('keeps protected system keys local', () => {
    const policy = createBlockedKeyPolicy();

    expect(policy.isBlocked({ code: 'MetaLeft', metaKey: true })).toBe(true);
    expect(shouldForwardKeyboardEvent({ code: 'Tab', altKey: true }, policy)).toBe(false);
    expect(shouldForwardKeyboardEvent({ code: 'Delete', ctrlKey: true, altKey: true }, policy)).toBe(false);
    expect(shouldForwardKeyboardEvent({ code: 'KeyA' }, policy)).toBe(true);
  });
});

describe('remote input batcher', () => {
  it('flushes once the batch reaches its configured size', () => {
    const flushed: RemoteInputMessage[][] = [];
    const batcher = createRemoteInputBatcher(
      'session-1',
      (envelope) => flushed.push(envelope.events),
      1_000,
      2
    );

    batcher.push(keyMessage('KeyA'));
    expect(batcher.size()).toBe(1);

    batcher.push(keyMessage('KeyB'));
    expect(batcher.size()).toBe(0);
    expect(flushed).toHaveLength(1);
    expect(flushed[0].map((event) => event.code)).toEqual(['KeyA', 'KeyB']);

    batcher.stop();
  });
});
