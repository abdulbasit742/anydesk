export type MigrationRisk = "low" | "medium" | "high" | "critical";
export interface MigrationRiskInput { touchesAuth: boolean; touchesBilling: boolean; destructive: boolean; backfillRows: number; }
export function classifyMigrationRisk(input: MigrationRiskInput): MigrationRisk { if (input.destructive && (input.touchesAuth || input.touchesBilling)) return "critical"; if (input.destructive || input.backfillRows > 1000000) return "high"; if (input.touchesAuth || input.touchesBilling || input.backfillRows > 50000) return "medium"; return "low"; }
