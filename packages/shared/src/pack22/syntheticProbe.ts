export type SyntheticProbeKind = "api_health" | "login" | "signaling" | "turn" | "web_dashboard" | "desktop_update";

export interface SyntheticProbeResult {
  kind: SyntheticProbeKind;
  ok: boolean;
  latencyMs: number;
}

export function syntheticProbeFailed(result: SyntheticProbeResult): boolean {
  return !result.ok || result.latencyMs > 5000;
}
