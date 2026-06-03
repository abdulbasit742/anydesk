// src/lib/credentialVault.js
// CredentialVault — XOR + btoa/atob encryption, localStorage persistence

const VAULT_PREFIX = '__bsp_vault__';
const DEFAULT_KEY = 'bolt-studio-pro-2025';

// ─── Crypto Helpers ───────────────────────────────────────────────────────────

/**
 * XOR-encode a string with a repeating key.
 * Returns base64-encoded ciphertext.
 */
function xorEncode(str, key) {
  let out = '';
  for (let i = 0; i < str.length; i++) {
    out += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(out);
}

/**
 * XOR-decode a base64-encoded ciphertext back to plaintext.
 */
function xorDecode(encoded, key) {
  let str;
  try { str = atob(encoded); } catch { return null; }
  let out = '';
  for (let i = 0; i < str.length; i++) {
    out += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return out;
}

// ─── CredentialVault ─────────────────────────────────────────────────────────

class CredentialVault {
  constructor(masterKey = DEFAULT_KEY) {
    this._key = masterKey;
  }

  /** Change the master encryption key at runtime. */
  setKey(key) {
    if (!key || typeof key !== 'string') throw new TypeError('Key must be a non-empty string');
    this._key = key;
  }

  /**
   * encrypt(value, key?) — returns an encrypted string.
   * value can be a string or object (JSON serialised).
   */
  encrypt(value, key = this._key) {
    const serialised = typeof value === 'string' ? value : JSON.stringify(value);
    return xorEncode(serialised, key);
  }

  /**
   * decrypt(encrypted, key?) — returns the original value (string or parsed object).
   */
  decrypt(encrypted, key = this._key) {
    const raw = xorDecode(encrypted, key);
    if (raw === null) return null;
    try { return JSON.parse(raw); } catch { return raw; }
  }

  /**
   * store(accountId, credential) — encrypts and persists to localStorage.
   * credential: { apiKey, platform, label, ... }
   */
  store(accountId, credential) {
    if (!accountId) throw new TypeError('accountId is required');
    if (!credential) throw new TypeError('credential is required');

    const storageKey = this._storageKey(accountId);
    const encrypted = this.encrypt(credential);
    const envelope = JSON.stringify({
      v: 1,
      accountId,
      storedAt: Date.now(),
      data: encrypted,
    });
    try {
      localStorage.setItem(storageKey, envelope);
    } catch {
      console.warn('[CredentialVault] localStorage unavailable, storing in memory only');
      this._memStore = this._memStore || {};
      this._memStore[storageKey] = envelope;
    }
    return true;
  }

  /**
   * retrieve(accountId) — returns decrypted credential or null.
   */
  retrieve(accountId) {
    if (!accountId) return null;
    const storageKey = this._storageKey(accountId);
    let raw;
    try {
      raw = localStorage.getItem(storageKey);
    } catch {
      raw = (this._memStore || {})[storageKey] || null;
    }
    if (!raw) return null;
    try {
      const envelope = JSON.parse(raw);
      return this.decrypt(envelope.data);
    } catch {
      return null;
    }
  }

  /**
   * remove(accountId) — delete stored credential.
   */
  remove(accountId) {
    if (!accountId) return false;
    const storageKey = this._storageKey(accountId);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      if (this._memStore) delete this._memStore[storageKey];
    }
    return true;
  }

  /**
   * listAccountIds() — return all stored account IDs in vault.
   */
  listAccountIds() {
    const ids = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(VAULT_PREFIX)) {
          ids.push(k.slice(VAULT_PREFIX.length));
        }
      }
    } catch { /* no localStorage */ }
    return ids;
  }

  /**
   * validateCredential(platform, cred) — basic sanity checks.
   * Returns { valid: boolean, errors: string[] }
   */
  validateCredential(platform, cred) {
    const errors = [];
    if (!cred) { return { valid: false, errors: ['Credential is empty'] }; }
    if (!cred.apiKey && !cred.token) errors.push('Missing apiKey or token');
    if (!cred.platform && !platform) errors.push('Missing platform');
    if (cred.apiKey && cred.apiKey.length < 8) errors.push('apiKey appears too short');

    // Platform-specific checks
    const p = (platform || cred.platform || '').toLowerCase();
    if (p === 'openai' && cred.apiKey && !cred.apiKey.startsWith('sk-')) {
      errors.push('OpenAI keys should start with "sk-"');
    }
    if (p === 'anthropic' && cred.apiKey && !cred.apiKey.startsWith('sk-ant-')) {
      errors.push('Anthropic keys should start with "sk-ant-"');
    }

    return { valid: errors.length === 0, errors };
  }

  _storageKey(accountId) {
    return `${VAULT_PREFIX}${accountId}`;
  }
}

const credentialVault = new CredentialVault();
export default credentialVault;
export { CredentialVault };
