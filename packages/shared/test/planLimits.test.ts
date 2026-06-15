import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_PLAN_LIMITS, emptyUsageSnapshot, enforcePlanLimit, incrementUsage } from '../src/billing/index.js';

test('plan limits reject usage beyond file transfer cap', () => {
  const base = emptyUsageSnapshot('org1', 0, 1000);
  const used = incrementUsage(base, 'fileTransferBytes', DEFAULT_PLAN_LIMITS.free.fileTransferBytesPerMonth);
  const decision = enforcePlanLimit(DEFAULT_PLAN_LIMITS.free, used, 'fileTransferBytes', 1);
  assert.equal(decision.allowed, false);
});
