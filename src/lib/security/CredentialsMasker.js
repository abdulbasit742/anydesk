// CredentialsMasker.js — Formats active API keys (e.g., sk-ant-••••xxxx) for visual display
export function maskApiKey(key, visibleStart = 6, visibleEnd = 4) {
  if (!key || key.length <= visibleStart + visibleEnd) {
    return key ? '*'.repeat(key.length) : '';
  }
  const start = key.slice(0, visibleStart);
  const end = key.slice(-visibleEnd);
  const middle = '•'.repeat(Math.max(4, key.length - visibleStart - visibleEnd));
  return `${start}${middle}${end}`;
}

export function maskByPlatform(key, platform) {
  const prefixes = {
    bolt: { start: 8, end: 4 },
    claude: { start: 7, end: 4 },
    openai: { start: 3, end: 4 },
    lovable: { start: 6, end: 4 },
    default: { start: 6, end: 4 },
  };
  const config = prefixes[platform?.toLowerCase()] || prefixes.default;
  return maskApiKey(key, config.start, config.end);
}

export function maskObject(obj, keys = ['apiKey', 'token', 'secret', 'password', 'sessionCookie']) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  for (const key of keys) {
    if (key in result && typeof result[key] === 'string') {
      result[key] = maskApiKey(result[key]);
    }
  }
  return result;
}

export function isLikelyApiKey(str) {
  if (!str || str.length < 16) return false;
  return /^(sk-|pk-|api_|tok_|key_|sess_|bearer\s)/i.test(str) || /^[a-zA-Z0-9\-_]{20,}$/.test(str);
}

export function formatForDisplay(key, platform) {
  if (!key) return '— not set —';
  const masked = maskByPlatform(key, platform);
  return masked;
}
