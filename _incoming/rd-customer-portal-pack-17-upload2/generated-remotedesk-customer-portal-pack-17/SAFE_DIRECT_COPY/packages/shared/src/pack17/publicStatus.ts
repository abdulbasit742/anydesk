export type PublicStatusLevel = "operational" | "degraded" | "partial_outage" | "major_outage" | "maintenance";

export function publicStatusPriority(level: PublicStatusLevel): number {
  return { operational: 0, maintenance: 1, degraded: 2, partial_outage: 3, major_outage: 4 }[level];
}

export function worstPublicStatus(levels: readonly PublicStatusLevel[]): PublicStatusLevel {
  return levels.reduce((worst, level) => publicStatusPriority(level) > publicStatusPriority(worst) ? level : worst, "operational" as PublicStatusLevel);
}
