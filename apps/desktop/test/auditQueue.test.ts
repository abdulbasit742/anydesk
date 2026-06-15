import { describe, expect, it } from 'vitest';
import { AuditQueue } from '../src/renderer/src/services/auditQueue.js';
import type { DesktopAuditEvent } from '../src/renderer/src/types/audit.js';

function event(id: string): DesktopAuditEvent {
  return { id, type: 'test', category: 'session', severity: 'info', occurredAt: new Date().toISOString(), metadata: {} };
}

describe('AuditQueue', () => {
  it('keeps failed emits queued and flushes later', async () => {
    let online = false;
    const sent: string[] = [];
    const queue = new AuditQueue({ transport: { emitAudit: async (e) => { if (!online) throw new Error('offline'); sent.push(e.id); } } });
    await queue.enqueue(event('a'));
    expect(queue.size()).toBe(1);
    online = true;
    await queue.flush();
    expect(sent).toEqual(['a']);
    expect(queue.size()).toBe(0);
  });
});
