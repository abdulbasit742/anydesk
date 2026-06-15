import { describe, expect, it } from 'vitest';
import { createFileTransferItem, fileTransferReducer, initialFileTransferState } from '../src/renderer/src/features/fileTransfer/fileTransferStore.js';

describe('fileTransferReducer', () => {
  it('moves an accepted transfer through progress to completion', () => {
    const item = createFileTransferItem({ id: 't1', direction: 'send', fileName: 'report.pdf', size: 1000, chunkSize: 100 });
    let state = fileTransferReducer(initialFileTransferState, { type: 'offer-created', item });
    state = fileTransferReducer(state, { type: 'accepted', id: 't1', now: 1000 });
    state = fileTransferReducer(state, { type: 'started', id: 't1', now: 1100 });
    state = fileTransferReducer(state, { type: 'progress', id: 't1', bytes: 500, chunkIndex: 4, now: 2100 });
    state = fileTransferReducer(state, { type: 'completed', id: 't1', checksum: 'abc', now: 3100 });
    expect(state.items.t1.status).toBe('completed');
    expect(state.items.t1.transferredBytes).toBe(1000);
    expect(state.items.t1.checksum).toBe('abc');
  });

  it('clears terminal transfers only', () => {
    const done = createFileTransferItem({ id: 'done', direction: 'send', fileName: 'a.txt', size: 1, chunkSize: 1, status: 'completed' });
    const active = createFileTransferItem({ id: 'active', direction: 'receive', fileName: 'b.txt', size: 1, chunkSize: 1, status: 'transferring' });
    let state = fileTransferReducer(initialFileTransferState, { type: 'offer-created', item: done });
    state = fileTransferReducer(state, { type: 'offer-created', item: active });
    state = fileTransferReducer(state, { type: 'clear-terminal' });
    expect(state.items.done).toBeUndefined();
    expect(state.items.active).toBeDefined();
  });
});
