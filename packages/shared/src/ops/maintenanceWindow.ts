export interface MaintenanceWindow {
  id: string;
  startsAt: string;
  endsAt: string;
  affectsNewSessions: boolean;
  message: string;
}

export function isMaintenanceActive(window: MaintenanceWindow, now = new Date()): boolean {
  return new Date(window.startsAt) <= now && now < new Date(window.endsAt);
}

export function shouldBlockNewSessions(window: MaintenanceWindow, now = new Date()): boolean {
  return window.affectsNewSessions && isMaintenanceActive(window, now);
}
