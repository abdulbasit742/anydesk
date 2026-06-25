// CookieParser.js — Diagnostic parser dissecting session cookies for auth parameters
export function parseCookieString(cookieStr) {
  if (!cookieStr) return {};
  return Object.fromEntries(
    cookieStr.split(';').map(part => {
      const [key, ...vals] = part.trim().split('=');
      return [decodeURIComponent(key.trim()), decodeURIComponent(vals.join('=').trim())];
    })
  );
}

export function parseSetCookieHeader(header) {
  const parts = header.split(';').map(p => p.trim());
  const [nameValue, ...attributes] = parts;
  const [name, ...valParts] = nameValue.split('=');
  const value = valParts.join('=');

  const result = { name: name.trim(), value: value.trim() };
  for (const attr of attributes) {
    const [k, v] = attr.split('=').map(p => p.trim());
    const key = k.toLowerCase();
    if (key === 'expires') result.expires = new Date(v);
    else if (key === 'max-age') result.maxAge = parseInt(v);
    else if (key === 'domain') result.domain = v;
    else if (key === 'path') result.path = v;
    else if (key === 'samesite') result.sameSite = v;
    else if (key === 'secure') result.secure = true;
    else if (key === 'httponly') result.httpOnly = true;
  }
  return result;
}

export function extractAuthCookies(cookies) {
  const parsed = typeof cookies === 'string' ? parseCookieString(cookies) : cookies;
  const AUTH_KEYS = ['session', 'sess', 'auth', 'token', 'jwt', 'sid', '_session', '__session'];
  return Object.fromEntries(
    Object.entries(parsed).filter(([k]) => AUTH_KEYS.some(ak => k.toLowerCase().includes(ak)))
  );
}

export function validateCookieSecurity(cookie) {
  const issues = [];
  if (!cookie.secure) issues.push('Missing Secure flag — cookie can be sent over HTTP');
  if (!cookie.httpOnly) issues.push('Missing HttpOnly flag — accessible via JavaScript');
  if (!cookie.sameSite || cookie.sameSite === 'None') issues.push('SameSite not set or None — CSRF risk');
  if (cookie.expires && new Date(cookie.expires) < new Date()) issues.push('Cookie already expired');
  return { secure: issues.length === 0, issues };
}
