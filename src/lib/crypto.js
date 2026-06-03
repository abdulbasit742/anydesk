// crypto.js — AES-256-GCM encryption/decryption helpers using Web Crypto API
const SALT_STRING = 'agentflow-secure-encryption-salt-2026';

async function deriveKey(masterPassword) {
  const enc = new TextEncoder();
  const rawKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(masterPassword),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(SALT_STRING),
      iterations: 100000,
      hash: 'SHA-256'
    },
    rawKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts cleartext using AES-256-GCM derived from passphrase.
 * @param {string} text - The raw text to encrypt.
 * @param {string} passphrase - The encryption master secret.
 * @returns {Promise<string>} Base64-encoded encrypted token.
 */
export async function encrypt(text, passphrase = 'agentflow-default-vault-key') {
  try {
    const enc = new TextEncoder();
    const key = await deriveKey(passphrase);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(text)
    );
    
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (err) {
    console.error('Encryption wrapper error:', err);
    throw err;
  }
}

/**
 * Decrypts encrypted base64 payload.
 * @param {string} ciphertext - Base64 encoded payload.
 * @param {string} passphrase - The encryption master secret.
 * @returns {Promise<string>} Decrypted cleartext.
 */
export async function decrypt(ciphertext, passphrase = 'agentflow-default-vault-key') {
  try {
    const key = await deriveKey(passphrase);
    const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.error('Decryption wrapper error:', err);
    throw err;
  }
}
