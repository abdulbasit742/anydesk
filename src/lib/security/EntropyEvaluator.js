// EntropyEvaluator.js — Estimates cryptographic key strength and character-set diversity
export function evaluateEntropy(key) {
  if (!key) return { bits: 0, strength: 'none', score: 0 };

  const charsets = {
    lowercase: /[a-z]/.test(key) ? 26 : 0,
    uppercase: /[A-Z]/.test(key) ? 26 : 0,
    digits: /[0-9]/.test(key) ? 10 : 0,
    symbols: /[^a-zA-Z0-9]/.test(key) ? 32 : 0,
  };

  const poolSize = Object.values(charsets).reduce((a, b) => a + b, 0);
  const bits = Math.floor(key.length * Math.log2(poolSize || 1));

  const strength =
    bits < 28 ? 'very_weak' :
    bits < 36 ? 'weak' :
    bits < 60 ? 'moderate' :
    bits < 128 ? 'strong' : 'very_strong';

  const score = Math.min(100, Math.round((bits / 128) * 100));

  return {
    bits,
    strength,
    score,
    length: key.length,
    poolSize,
    charsets: Object.fromEntries(Object.entries(charsets).filter(([, v]) => v > 0).map(([k]) => [k, true])),
    recommendations: getRecommendations(charsets, key.length, bits),
  };
}

function getRecommendations(charsets, length, bits) {
  const recs = [];
  if (length < 16) recs.push('Use at least 16 characters');
  if (!charsets.uppercase) recs.push('Add uppercase letters');
  if (!charsets.digits) recs.push('Add numbers');
  if (!charsets.symbols) recs.push('Add special characters (!@#$%^&*)');
  if (bits < 60) recs.push('Increase key length for better security');
  return recs;
}

export function generateSecureKey(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  const arr = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(arr, b => chars[b % chars.length]).join('');
}
