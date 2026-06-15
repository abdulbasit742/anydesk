export interface DashboardUsageMeter { key: string; label: string; used: number; limit: number; unit: "sessions" | "minutes" | "bytes" | "devices" | "tickets"; }
export function usagePercent(meter: DashboardUsageMeter): number { return meter.limit <= 0 ? 0 : Math.min(100, Math.round((meter.used / meter.limit) * 100)); }
export interface DashboardTimelineItem { id: string; at: string; label: string; severity: "info" | "warning" | "error"; }
