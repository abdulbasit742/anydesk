/**
 * csvReporter.js — Generate and download CSV reports
 * Supports: accounts, relay log, fleet history, credit history, scheduler log
 */

import { getAccounts, getStats } from './accountStore';
import { getRelayLog, getRelayStats } from './relayEngine';
import { getFleetHistory } from './fleetPromptEngine';
import { getCreditHistory, getBurnRate } from './creditHistory';
import { getSchedulerLog } from './scheduler';

/* ── CSV Utilities ─────────────────────────────────────────────── */
function _escape(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function _makeCSV(headers, rows) {
  const lines = [headers.map(_escape).join(',')];
  rows.forEach((row) => lines.push(row.map(_escape).join(',')));
  return lines.join('\n');
}

function _download(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Account Report ────────────────────────────────────────────── */
export function downloadAccountsReport() {
  const accounts = getAccounts();
  const headers = [
    'ID', 'Name', 'Platform', 'Email', 'Credits', 'Max Credits',
    'Credit %', 'Status', 'Tasks Completed', 'Tasks Failed',
    'Relay Count', 'Last Used', 'Created At', 'Priority', 'Notes',
  ];
  const rows = accounts.map((a) => [
    a.id, a.name, a.platform, a.email,
    a.credits, a.maxCredits,
    a.maxCredits > 0 ? Math.round((a.credits / a.maxCredits) * 100) + '%' : '0%',
    a.status, a.tasksCompleted, a.tasksFailed,
    a.relayCount, a.lastUsed, a.createdAt, a.priority, a.notes,
  ]);
  _download(_makeCSV(headers, rows), `accounts-${_dateStr()}.csv`);
  return { rows: rows.length };
}

/* ── Relay Log Report ──────────────────────────────────────────── */
export function downloadRelayReport() {
  const log = getRelayLog();
  const headers = [
    'Timestamp', 'Type', 'From Account', 'To Account', 'Platform',
    'Task', 'Credits Used', 'Reason',
  ];
  const rows = log.map((e) => [
    e.ts, e.type, e.fromName || '', e.toName || '', e.toPlatform || '',
    e.task || '', e.creditsUsed || 0, e.reason || '',
  ]);
  _download(_makeCSV(headers, rows), `relay-log-${_dateStr()}.csv`);
  return { rows: rows.length };
}

/* ── Fleet History Report ──────────────────────────────────────── */
export function downloadFleetReport() {
  const history = getFleetHistory();
  const headers = [
    'Job ID', 'Label', 'Status', 'Target Count', 'Success Count',
    'Failed Count', 'Priority', 'Estimated Credits', 'Created At', 'Completed At',
  ];
  const rows = history.map((j) => [
    j.id, j.label, j.status, j.targetCount,
    j.successCount, j.failedCount, j.priority,
    j.estimatedCredits, j.createdAt, j.completedAt || '',
  ]);
  _download(_makeCSV(headers, rows), `fleet-history-${_dateStr()}.csv`);
  return { rows: rows.length };
}

/* ── Credit History Report ─────────────────────────────────────── */
export function downloadCreditHistoryReport() {
  const history = getCreditHistory(30);
  const { dailyBurn, trend, daysUntilEmpty } = getBurnRate(7);
  const headers = ['Date', 'Total Credits', 'Account Count', 'Timestamp'];
  const rows = history.map((h) => [h.date, h.total, h.accountCount, h.ts]);

  // Append summary rows
  rows.push([]);
  rows.push(['--- Summary ---', '', '', '']);
  rows.push(['Daily Burn Rate', dailyBurn, '', '']);
  rows.push(['Trend', trend, '', '']);
  rows.push(['Days Until Empty', daysUntilEmpty === Infinity ? 'N/A' : daysUntilEmpty, '', '']);

  _download(_makeCSV(headers, rows), `credit-history-${_dateStr()}.csv`);
  return { rows: rows.length };
}

/* ── Scheduler Log Report ──────────────────────────────────────── */
export function downloadSchedulerReport() {
  const log = getSchedulerLog(200);
  const headers = ['Timestamp', 'Type', 'Task ID', 'Task Name', 'Account', 'Credits Used', 'Relayed', 'Error'];
  const rows = log.map((e) => [
    e.ts, e.type, e.taskId || '', e.taskName || '',
    e.accountName || '', e.creditsUsed || 0,
    e.relayed ? 'Yes' : 'No', e.error || '',
  ]);
  _download(_makeCSV(headers, rows), `scheduler-log-${_dateStr()}.csv`);
  return { rows: rows.length };
}

/* ── Full Daily Report ─────────────────────────────────────────── */
export function downloadDailyReport() {
  const accounts = getAccounts();
  const stats = getStats();
  const { dailyBurn, trend, daysUntilEmpty } = getBurnRate(7);
  const relayStats = getRelayStats();
  const today = _dateStr();

  const sections = [];

  // Header
  sections.push(`AgentFlow Daily Report — ${today}`);
  sections.push('='.repeat(60));
  sections.push('');

  // Account Summary
  sections.push('ACCOUNT SUMMARY');
  sections.push('-'.repeat(40));
  sections.push(`Total Accounts: ${stats.total}`);
  sections.push(`Active: ${stats.active} | Paused: ${stats.paused} | Exhausted: ${stats.exhausted}`);
  sections.push(`Total Credits Remaining: ${stats.totalCredits.toLocaleString()}`);
  sections.push(`Daily Burn Rate: ${dailyBurn} credits/day (${trend})`);
  sections.push(`Estimated Days Until Empty: ${daysUntilEmpty === Infinity ? 'N/A' : daysUntilEmpty}`);
  sections.push('');

  // Per-account table
  sections.push('ACCOUNTS');
  sections.push('-'.repeat(40));
  accounts.forEach((a) => {
    const pct = a.maxCredits > 0 ? Math.round((a.credits / a.maxCredits) * 100) : 0;
    sections.push(`  ${a.name.padEnd(20)} ${a.platform.padEnd(15)} ${String(a.credits).padStart(6)} credits (${pct}%) [${a.status}]`);
  });
  sections.push('');

  // Relay Stats
  sections.push('RELAY STATS');
  sections.push('-'.repeat(40));
  sections.push(`Total Relays: ${relayStats.totalRelays}`);
  sections.push(`Successful: ${relayStats.successRelays} | Failed: ${relayStats.failedRelays}`);
  sections.push(`Credits Relayed: ${relayStats.creditsRelayed}`);
  sections.push('');

  sections.push(`Generated by AgentFlow at ${new Date().toISOString()}`);

  const text = sections.join('\n');
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `agentflow-daily-report-${today}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  return { generated: true, date: today };
}

/* ── All Reports Bundle ────────────────────────────────────────── */
export function downloadAllReports() {
  downloadAccountsReport();
  setTimeout(() => downloadRelayReport(), 300);
  setTimeout(() => downloadFleetReport(), 600);
  setTimeout(() => downloadCreditHistoryReport(), 900);
  setTimeout(() => downloadSchedulerReport(), 1200);
  setTimeout(() => downloadDailyReport(), 1500);
  return { count: 6 };
}

/* ── Helpers ───────────────────────────────────────────────────── */
function _dateStr() {
  return new Date().toISOString().split('T')[0];
}
