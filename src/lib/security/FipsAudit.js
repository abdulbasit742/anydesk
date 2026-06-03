// FipsAudit.js — Scans active keys against FIPS 140-2 and GDPR compliance
import { evaluateEntropy } from './EntropyEvaluator.js';

const FIPS_MIN_KEY_BITS = 112;
const GDPR_MIN_KEY_BITS = 128;

export function auditKey(key, metadata = {}) {
  const entropy = evaluateEntropy(key);
  const checks = [];

  checks.push({
    id: 'fips-key-length',
    name: 'FIPS 140-2: Minimum Key Strength',
    passed: entropy.bits >= FIPS_MIN_KEY_BITS,
    detail: `${entropy.bits} bits (min: ${FIPS_MIN_KEY_BITS})`,
    standard: 'FIPS 140-2',
  });

  checks.push({
    id: 'gdpr-key-strength',
    name: 'GDPR: Adequate Encryption Strength',
    passed: entropy.bits >= GDPR_MIN_KEY_BITS,
    detail: `${entropy.bits} bits (min: ${GDPR_MIN_KEY_BITS})`,
    standard: 'GDPR Art. 32',
  });

  const keyAge = metadata.createdAt
    ? (Date.now() - new Date(metadata.createdAt).getTime()) / (1000 * 86400)
    : 0;

  checks.push({
    id: 'key-rotation',
    name: 'Key Rotation Policy (90-day max)',
    passed: keyAge <= 90,
    detail: `Age: ${Math.round(keyAge)} days`,
    standard: 'NIST SP 800-57',
  });

  checks.push({
    id: 'no-hardcoded',
    name: 'No Hardcoded Credentials Pattern',
    passed: !key.startsWith('sk-test-') && !key.includes('example') && !key.includes('dummy'),
    detail: 'Pattern analysis',
    standard: 'OWASP A02',
  });

  const passed = checks.filter(c => c.passed).length;
  const score = Math.round((passed / checks.length) * 100);

  return { checks, passed, total: checks.length, score, compliant: score >= 75, entropy };
}

export function auditAllKeys(accounts) {
  return accounts.map(account => ({
    accountId: account.id,
    platform: account.platform,
    label: account.label,
    audit: auditKey(account.apiKey || '', { createdAt: account.keyCreatedAt }),
  }));
}
