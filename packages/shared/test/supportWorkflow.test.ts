import test from 'node:test';
import assert from 'node:assert/strict';
import { canTransitionTicketStatus, transitionTicketStatus, validateTicketSubject } from '../src/support/index.js';

test('support workflow allows reopening closed tickets', () => {
  assert.equal(canTransitionTicketStatus('closed', 'open'), true);
});

test('support validators reject short subjects', () => {
  assert.deepEqual(validateTicketSubject('hey'), ['subject must be at least 5 characters']);
});

test('support transition updates timestamp', () => {
  const ticket = { id: 't1', organizationId: 'o1', requesterUserId: 'u1', subject: 'Need help', status: 'open' as const, priority: 'normal' as const, tags: [], createdAtMs: 1, updatedAtMs: 1 };
  assert.equal(transitionTicketStatus(ticket, 'pending', 5).updatedAtMs, 5);
});
