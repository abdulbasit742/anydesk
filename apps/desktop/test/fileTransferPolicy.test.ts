import { describe, expect, it } from 'vitest';
import { DEFAULT_FILE_TRANSFER_POLICY, evaluateFileAgainstPolicy } from '../src/renderer/src/features/fileTransfer/fileTransferPolicy.js';

describe('file transfer policy', () => {
  it('blocks dangerous executable extensions', () => {
    const policy = { ...DEFAULT_FILE_TRANSFER_POLICY, enabled: true };
    const decision = evaluateFileAgainstPolicy({ name: 'setup.exe', size: 10 }, policy);
    expect(decision.allowed).toBe(false);
    expect(decision.reasons.join(' ')).toContain('.exe');
  });

  it('warns for large archives without blocking allowed size', () => {
    const policy = { ...DEFAULT_FILE_TRANSFER_POLICY, enabled: true, maxFileBytes: 1000, warnAboveBytes: 100 };
    const decision = evaluateFileAgainstPolicy({ name: 'logs.zip', size: 200 }, policy);
    expect(decision.allowed).toBe(true);
    expect(decision.requiresWarning).toBe(true);
  });
});
