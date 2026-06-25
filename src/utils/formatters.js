// formatters.js — number, date, byte, duration utilities

export const formatNumber = (n, decimals = 0) => {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Number(n).toFixed(decimals);
};

export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024, sizes = ['B','KB','MB','GB','TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

export const formatDuration = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms/1000).toFixed(1)}s`;
  if (ms < 3600000) return `${Math.floor(ms/60000)}m ${Math.floor((ms%60000)/1000)}s`;
  return `${Math.floor(ms/3600000)}h ${Math.floor((ms%3600000)/60000)}m`;
};

export const formatDate = (iso, opts = {}) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', ...opts });

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

export const formatDateTime = (iso) => `${formatDate(iso)} ${formatTime(iso)}`;

export const formatRelative = (iso) => {
  const s = (Date.now() - new Date(iso)) / 1000;
  if (s < 5) return 'just now';
  if (s < 60) return `${~~s}s ago`;
  if (s < 3600) return `${~~(s/60)}m ago`;
  if (s < 86400) return `${~~(s/3600)}h ago`;
  if (s < 2592000) return `${~~(s/86400)}d ago`;
  if (s < 31536000) return `${~~(s/2592000)}mo ago`;
  return `${~~(s/31536000)}y ago`;
};

export const formatPercent = (n, decimals = 1) => `${(n * 100).toFixed(decimals)}%`;

export const formatCurrency = (n, sym = '$', decimals = 2) => `${sym}${Number(n).toFixed(decimals)}`;

export const truncate = (str, len = 50, suffix = '…') =>
  str?.length > len ? str.slice(0, len) + suffix : str || '';

export const pluralize = (n, word, plural) => `${n} ${n === 1 ? word : (plural || word + 's')}`;

export const pad = (n, width = 2, char = '0') => String(n).padStart(width, char);
