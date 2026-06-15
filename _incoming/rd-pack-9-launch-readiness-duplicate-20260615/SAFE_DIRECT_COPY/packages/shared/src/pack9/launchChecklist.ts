export type LaunchCheckStatus = "pass" | "warn" | "fail" | "not_applicable";
export interface LaunchCheck { id: string; area: "api" | "web" | "desktop" | "infra" | "security" | "support" | "billing"; label: string; status: LaunchCheckStatus; required: boolean; }
export function isLaunchBlocked(checks: readonly LaunchCheck[]): boolean { return checks.some((check) => check.required && check.status === "fail"); }
export function summarizeLaunchChecks(checks: readonly LaunchCheck[]): Record<LaunchCheckStatus, number> { return checks.reduce<Record<LaunchCheckStatus, number>>((acc, check) => ({ ...acc, [check.status]: acc[check.status] + 1 }), { pass: 0, warn: 0, fail: 0, not_applicable: 0 }); }
