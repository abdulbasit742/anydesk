/**
 * creditHistory.js — 30-day credit snapshot history + burn rate analytics
 * Storage key: 'agentflow_credit_history'
 * Takes snapshots automatically; call takeDailySnapshot() once per day.
 */

import { getAccounts } from './accountStore';
import { logError } from './errorLogger';

const HISTORY_KEY = 'agentflow_credit_history';
const MAX_DAYS = 30;

/* ── Snapshot Structure ────────────────────────────────────────── */
// { date: 'YYYY-MM-DD', total: number, perAccount: { [id]: number }, ts: ISO }

function _read() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function _write(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_DAYS)));
}

/* ── Take Snapshot ─────────────────────────────────────────────── */
export function takeDailySnapshot() {
  const accounts = getAccounts();
  const today = new Date().toISOString().split('T')[0];

  const history = _read();
  // Don't double-snapshot same day
  if (history.length > 0 && history[0].date === today) {
    return history[0];
  }

  const perAccount = {};
  let total = 0;
  accounts.forEach((a) => {
    perAccount[a.id] = a.credits;
    total += a.credits;
  });

  const snapshot = {
    date: today,
    total,
    perAccount,
    accountCount: accounts.length,
    ts: new Date().toISOString(),
  };

  history.unshift(snapshot);
  _write(history);
  return snapshot;
}

/* ── Get History ───────────────────────────────────────────────── */
export function getCreditHistory(days = 30) {
  return _read().slice(0, days);
}

export function getLatestSnapshot() {
  const h = _read();
  return h[0] || null;
}

/* ── Burn Rate ─────────────────────────────────────────────────── */
/**
 * getBurnRate
 * Returns average daily credit consumption over last N days.
 * Uses linear regression for smoother estimate.
 */
export function getBurnRate(days = 7) {
  const history = _read().slice(0, days);
  if (history.length < 2) {
    // Fallback: estimate from single snapshot
    const snap = history[0];
    if (!snap) return { dailyBurn: 0, trend: 'stable', daysUntilEmpty: Infinity };
    return { dailyBurn: 0, trend: 'stable', daysUntilEmpty: Infinity };
  }

  // Compute deltas (oldest to newest = history reversed)
  const oldest = history[history.length - 1];
  const newest = history[0];
  const daySpan = Math.max(1, history.length - 1);

  const totalDrop = oldest.total - newest.total;
  const dailyBurn = Math.max(0, totalDrop / daySpan);

  // Simple trend: compare first half vs second half averages
  const mid = Math.floor(history.length / 2);
  const recentAvg = history.slice(0, mid).reduce((s, h) => s + h.total, 0) / Math.max(1, mid);
  const olderAvg =
    history.slice(mid).reduce((s, h) => s + h.total, 0) / Math.max(1, history.length - mid);

  let trend = 'stable';
  if (recentAvg < olderAvg * 0.85) trend = 'accelerating';
  else if (recentAvg > olderAvg * 1.05) trend = 'improving';

  const currentTotal = newest.total;
  const daysUntilEmpty = dailyBurn > 0 ? Math.ceil(currentTotal / dailyBurn) : Infinity;

  return { dailyBurn: Math.round(dailyBurn), trend, daysUntilEmpty, currentTotal };
}

/* ── Per-Account Burn ──────────────────────────────────────────── */
export function getAccountBurnRate(accountId, days = 7) {
  const history = _read().slice(0, days);
  if (history.length < 2) return { dailyBurn: 0, daysUntilEmpty: Infinity };

  const oldest = history[history.length - 1];
  const newest = history[0];
  const daySpan = Math.max(1, history.length - 1);

  const oldVal = oldest.perAccount?.[accountId] ?? 0;
  const newVal = newest.perAccount?.[accountId] ?? 0;
  const dailyBurn = Math.max(0, (oldVal - newVal) / daySpan);
  const daysUntilEmpty = dailyBurn > 0 ? Math.ceil(newVal / dailyBurn) : Infinity;

  return { dailyBurn: Math.round(dailyBurn), daysUntilEmpty, currentCredits: newVal };
}

/* ── Predictions ───────────────────────────────────────────────── */
export function getPredictions() {
  const { dailyBurn, daysUntilEmpty, trend, currentTotal } = getBurnRate(7);
  const accounts = getAccounts();

  const accountPredictions = accounts.map((acc) => {
    const { dailyBurn: adb, daysUntilEmpty: adue } = getAccountBurnRate(acc.id);
    return {
      id: acc.id,
      name: acc.name,
      platform: acc.platform,
      credits: acc.credits,
      dailyBurn: adb,
      daysUntilEmpty: adue,
      urgency: adue < 3 ? 'critical' : adue < 7 ? 'warning' : 'ok',
    };
  });

  return {
    overall: { dailyBurn, daysUntilEmpty, trend, currentTotal },
    accounts: accountPredictions,
    criticalAccounts: accountPredictions.filter((a) => a.urgency === 'critical'),
    warningAccounts: accountPredictions.filter((a) => a.urgency === 'warning'),
  };
}

/* ── Auto-init on load ─────────────────────────────────────────── */
export function initCreditHistory() {
  try {
    takeDailySnapshot();
  } catch (err) {
    logError('creditHistory', 'Failed to take snapshot', { msg: err.message });
  }
}

/* ── Export history as CSV ─────────────────────────────────────── */
export function exportHistoryCSV() {
  const history = _read();
  if (history.length === 0) return;

  const rows = [['Date', 'Total Credits', 'Account Count']];
  history.forEach((h) => rows.push([h.date, h.total, h.accountCount]));

  const csv = rows.map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `credit-history-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Clear ─────────────────────────────────────────────────────── */
export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
