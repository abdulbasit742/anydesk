/**
 * errorLogger.js — Global error capture + localStorage persistence
 * Max 100 entries, categorized, queryable
 * Storage key: 'agentflow_errors'
 */

const ERRORS_KEY = 'agentflow_errors';
const MAX_ERRORS = 100;

/* ── Internal ──────────────────────────────────────────────────── */
function _read() {
  try {
    return JSON.parse(localStorage.getItem(ERRORS_KEY) || '[]');
  } catch {
    return [];
  }
}

function _write(errors) {
  localStorage.setItem(ERRORS_KEY, JSON.stringify(errors.slice(0, MAX_ERRORS)));
}

/* ── Log ───────────────────────────────────────────────────────── */
/**
 * logError
 * @param {string} category  — e.g. 'relay', 'scheduler', 'api', 'ui'
 * @param {string} message   — human-readable error message
 * @param {object} [meta]    — optional extra data
 */
export function logError(category, message, meta = {}) {
  const errors = _read();
  const entry = {
    id: `err_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    category,
    message: String(message),
    meta,
    severity: meta.severity || 'error',
    ts: new Date().toISOString(),
    resolved: false,
  };
  errors.unshift(entry);
  _write(errors);
  return entry;
}

export function logWarning(category, message, meta = {}) {
  return logError(category, message, { ...meta, severity: 'warning' });
}

export function logInfo(category, message, meta = {}) {
  return logError(category, message, { ...meta, severity: 'info' });
}

/* ── Read ──────────────────────────────────────────────────────── */
export function getErrors({ category = null, severity = null, limit = 50 } = {}) {
  let errors = _read();
  if (category) errors = errors.filter((e) => e.category === category);
  if (severity) errors = errors.filter((e) => e.severity === severity);
  return errors.slice(0, limit);
}

export function getErrorCount() {
  return _read().filter((e) => !e.resolved && e.severity === 'error').length;
}

export function resolveError(id) {
  const errors = _read();
  const idx = errors.findIndex((e) => e.id === id);
  if (idx !== -1) {
    errors[idx].resolved = true;
    errors[idx].resolvedAt = new Date().toISOString();
    _write(errors);
  }
}

export function clearErrors() {
  localStorage.removeItem(ERRORS_KEY);
}

/* ── Global Error Boundary ─────────────────────────────────────── */
let _globalBoundaryInstalled = false;

export function installGlobalErrorBoundary() {
  if (_globalBoundaryInstalled) return;
  _globalBoundaryInstalled = true;

  window.addEventListener('error', (event) => {
    logError('global', event.message || 'Unknown error', {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack?.slice(0, 500),
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const msg =
      event.reason?.message || String(event.reason) || 'Unhandled Promise rejection';
    logError('promise', msg, {
      stack: event.reason?.stack?.slice(0, 500),
    });
  });
}

/* ── Error Stats ───────────────────────────────────────────────── */
export function getErrorStats() {
  const errors = _read();
  const categories = {};
  errors.forEach((e) => {
    categories[e.category] = (categories[e.category] || 0) + 1;
  });
  return {
    total: errors.length,
    unresolved: errors.filter((e) => !e.resolved).length,
    bySeverity: {
      error: errors.filter((e) => e.severity === 'error').length,
      warning: errors.filter((e) => e.severity === 'warning').length,
      info: errors.filter((e) => e.severity === 'info').length,
    },
    byCategory: categories,
    oldest: errors[errors.length - 1]?.ts || null,
    newest: errors[0]?.ts || null,
  };
}
