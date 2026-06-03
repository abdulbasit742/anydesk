// PersistEngine.js — Encrypted incremental state persistence using AES-CBC
const STORAGE_KEY = 'bsp_state_v1';
const IV_LENGTH = 16;

async function deriveKey(password) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode('bsp-salt-2024'), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-CBC', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function saveState(state, password = 'bsp-default') {
  try {
    const key = await deriveKey(password);
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const encoded = new TextEncoder().encode(JSON.stringify(state));
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, encoded);
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    localStorage.setItem(STORAGE_KEY, btoa(String.fromCharCode(...combined)));
    // Also persist to IndexedDB for larger payloads
    await saveToIndexedDB(combined);
    return true;
  } catch (err) {
    console.error('[PersistEngine] Save failed:', err);
    return false;
  }
}

export async function loadState(password = 'bsp-default') {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const key = await deriveKey(password);
    const combined = Uint8Array.from(atob(raw), c => c.charCodeAt(0));
    const iv = combined.slice(0, IV_LENGTH);
    const data = combined.slice(IV_LENGTH);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, data);
    return JSON.parse(new TextDecoder().decode(decrypted));
  } catch (err) {
    console.error('[PersistEngine] Load failed:', err);
    return null;
  }
}

function saveToIndexedDB(data) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('bsp-persist', 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore('state');
    req.onsuccess = e => {
      const tx = e.target.result.transaction('state', 'readwrite');
      tx.objectStore('state').put(data, 'main');
      tx.oncomplete = () => resolve();
      tx.onerror = reject;
    };
    req.onerror = reject;
  });
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}
