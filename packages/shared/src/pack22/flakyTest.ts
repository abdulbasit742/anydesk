export interface FlakyTestStats {
  runs: number;
  failures: number;
}

export function flakyRate(stats: FlakyTestStats): number {
  return stats.runs <= 0 ? 0 : stats.failures / stats.runs;
}

export function quarantineRecommended(stats: FlakyTestStats): boolean {
  return stats.runs >= 10 && flakyRate(stats) >= 0.2;
}
