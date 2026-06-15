export interface RetentionWindow {
  keepDays: number;
  legalHold: boolean;
}

export function canDeleteByRetention(createdAt: string, window: RetentionWindow, now = new Date()): boolean {
  if (window.legalHold) return false;
  return now.getTime() - new Date(createdAt).getTime() >= window.keepDays * 24 * 60 * 60 * 1000;
}
