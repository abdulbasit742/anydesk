// ExportSanitizer.js — Filters raw API tokens and session cookies from project exports
const SENSITIVE_PATTERNS = [
  /sk-ant-[a-zA-Z0-9\-_]{20,}/g,
  /sk-[a-zA-Z0-9]{20,}/g,
  /bearer\s+[a-zA-Z0-9\-_.]{20,}/gi,
  /session[_-]?token["\s:=]+["']?[a-zA-Z0-9\-_.]{20,}/gi,
  /api[_-]?key["\s:=]+["']?[a-zA-Z0-9\-_.]{20,}/gi,
];

export function sanitizeForExport(data) {
  let json = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  for (const pattern of SENSITIVE_PATTERNS) {
    json = json.replace(pattern, match => {
      const prefix = match.substring(0, 6);
      return `${prefix}${'*'.repeat(Math.max(0, match.length - 6))}`;
    });
  }

  return json;
}

export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  const sensitiveKeys = ['apiKey', 'api_key', 'token', 'secret', 'password', 'sessionCookie', 'authToken'];
  const sanitized = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    if (sensitiveKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

function sanitizeString(str) {
  let result = str;
  for (const pattern of SENSITIVE_PATTERNS) {
    result = result.replace(pattern, m => m.substring(0, 4) + '***');
  }
  return result;
}

export function exportToCSV(rows, headers) {
  const sanitizedRows = rows.map(row => sanitizeObject(row));
  const csvHeaders = headers.join(',');
  const csvRows = sanitizedRows.map(row =>
    headers.map(h => JSON.stringify(row[h] ?? '')).join(',')
  );
  return [csvHeaders, ...csvRows].join('\n');
}
