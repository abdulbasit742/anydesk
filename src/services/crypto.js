// crypto.js — lightweight encryption/encoding utilities (no external deps)

// Base64 encode/decode
export const b64encode = str => btoa(unescape(encodeURIComponent(str)));
export const b64decode = str => { try { return decodeURIComponent(escape(atob(str))); } catch { return ''; } };

// Simple XOR cipher for obfuscation (NOT cryptographic security — use for obscuring, not securing)
export const xorCipher = (text, key) => {
  const k = key.split('').map(c => c.charCodeAt(0));
  return text.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ k[i % k.length])).join('');
};

// Mask credential for display (show last 4 chars)
export const maskCredential = (str, visible = 4) =>
  str ? '•'.repeat(Math.max(0, str.length - visible)) + str.slice(-visible) : '';

// Simple hash (FNV-1a)
export const hash = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
};

// Generate random token
export const generateToken = (bytes = 16) => {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
};

// UUID v4
export const uuid = () => {
  const s = () => Math.random().toString(16).slice(2, 10);
  return `${s().slice(0,8)}-${s().slice(0,4)}-4${s().slice(0,3)}-${['8','9','a','b'][Math.floor(Math.random()*4)]}${s().slice(0,3)}-${s()}${s().slice(0,4)}`;
};

// Encode object as URL-safe base64
export const encodeData = obj => b64encode(JSON.stringify(obj));
export const decodeData = str => { try { return JSON.parse(b64decode(str)); } catch { return null; } };
