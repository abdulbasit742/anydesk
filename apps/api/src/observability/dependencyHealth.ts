import { prisma } from "../lib/prisma.js";

export interface DependencyHealth {
  name: string;
  status: "ok" | "degraded";
  checkedAt: string;
  latencyMs: number;
}

export async function checkDatabaseHealth(): Promise<DependencyHealth> {
  const startedAt = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      name: "database",
      status: "ok",
      checkedAt: new Date().toISOString(),
      latencyMs: Date.now() - startedAt
    };
  } catch {
    return {
      name: "database",
      status: "degraded",
      checkedAt: new Date().toISOString(),
      latencyMs: Date.now() - startedAt
    };
  }
}
