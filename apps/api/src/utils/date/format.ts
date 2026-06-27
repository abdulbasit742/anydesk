export const dateUtils = {
  formatRelative(date: Date): string { const diff = Date.now() - date.getTime(); if (diff < 60000) return "just now"; if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`; if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`; return `${Math.floor(diff / 86400000)}d ago`; },
  formatDuration(seconds: number): string { const h = Math.floor(seconds / 3600); const m = Math.floor((seconds % 3600) / 60); const s = seconds % 60; return [h > 0 ? `${h}h` : "", m > 0 ? `${m}m` : "", `${s}s`].filter(Boolean).join(" "); },
  startOfDay(date: Date = new Date()): Date { const d = new Date(date); d.setHours(0, 0, 0, 0); return d; },
  endOfDay(date: Date = new Date()): Date { const d = new Date(date); d.setHours(23, 59, 59, 999); return d; },
  addDays(date: Date, days: number): Date { return new Date(date.getTime() + days * 86400000); },
  daysBetween(a: Date, b: Date): number { return Math.floor(Math.abs(a.getTime() - b.getTime()) / 86400000); },
};
