// SessionWatchdog.js — Monitors platform session durations and token lifetimes
const watchers = new Map();

export function watchSession(platformId, expiresAt, onExpiry, warningThresholdMs = 5 * 60 * 1000) {
  clearWatcher(platformId);

  const now = Date.now();
  const expiresMs = new Date(expiresAt).getTime();
  const timeLeft = expiresMs - now;

  if (timeLeft <= 0) {
    onExpiry({ platformId, expired: true, timeLeft: 0 });
    return;
  }

  // Warning timer
  if (timeLeft > warningThresholdMs) {
    const warnTimer = setTimeout(() => {
      onExpiry({ platformId, expired: false, warning: true, timeLeft: warningThresholdMs });
    }, timeLeft - warningThresholdMs);

    // Expiry timer
    const expiryTimer = setTimeout(() => {
      onExpiry({ platformId, expired: true, timeLeft: 0 });
      watchers.delete(platformId);
    }, timeLeft);

    watchers.set(platformId, { warnTimer, expiryTimer, expiresAt });
  } else {
    const expiryTimer = setTimeout(() => {
      onExpiry({ platformId, expired: true, timeLeft: 0 });
      watchers.delete(platformId);
    }, timeLeft);

    watchers.set(platformId, { expiryTimer, expiresAt });
  }
}

export function clearWatcher(platformId) {
  const w = watchers.get(platformId);
  if (w) {
    clearTimeout(w.warnTimer);
    clearTimeout(w.expiryTimer);
    watchers.delete(platformId);
  }
}

export function getActiveWatchers() {
  const result = [];
  for (const [id, w] of watchers) {
    result.push({
      platformId: id,
      expiresAt: w.expiresAt,
      timeLeftMs: new Date(w.expiresAt).getTime() - Date.now(),
    });
  }
  return result;
}

export function clearAllWatchers() {
  for (const id of watchers.keys()) clearWatcher(id);
}
