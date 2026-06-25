// CryptoVault.js — Secure local sandboxing of credentials using AES-GCM
const VAULT_KEY = 'bsp_vault_v1';
const IV_LENGTH = 12;

async function getVaultKey(masterPassword) {
  const enc = new TextEncoder();
  const raw = await crypto.subtle.importKey('raw', enc.encode(masterPassword), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode('bsp-vault-salt'), iterations: 150000, hash: 'SHA-256' },
    raw, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  );
}

export async function vaultStore(key, value, masterPassword) {
  const cryptoKey = await getVaultKey(masterPassword);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(JSON.stringify(value));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, encoded);
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv); combined.set(new Uint8Array(encrypted), iv.length);

  const vault = JSON.parse(localStorage.getItem(VAULT_KEY) || '{}');
  vault[key] = btoa(String.fromCharCode(...combined));
  localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
}

export async function vaultRetrieve(key, masterPassword) {
  const vault = JSON.parse(localStorage.getItem(VAULT_KEY) || '{}');
  if (!vault[key]) return null;

  const cryptoKey = await getVaultKey(masterPassword);
  const combined = Uint8Array.from(atob(vault[key]), c => c.charCodeAt(0));
  const iv = combined.slice(0, IV_LENGTH);
  const data = combined.slice(IV_LENGTH);

  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, data);
  return JSON.parse(new TextDecoder().decode(decrypted));
}

export function vaultDelete(key) {
  const vault = JSON.parse(localStorage.getItem(VAULT_KEY) || '{}');
  delete vault[key];
  localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
}

export function vaultListKeys() {
  return Object.keys(JSON.parse(localStorage.getItem(VAULT_KEY) || '{}'));
}

export function vaultClear() {
  localStorage.removeItem(VAULT_KEY);
}
