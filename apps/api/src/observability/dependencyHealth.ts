import { prisma } from "../lib/prisma.js";

export interface DependencyHealth {
  name: string;
  status: "ok" | "degraded";
  checkedAt: string;
  latencyMs: number;
  cached: boolean;
  timedOut?: boolean;
}

const DATABASE_HEALTH_TIMEOUT_MS = 2_000;
const DATABASE_HEALTH_CACHE_TTL_MS = 5_000;
let databaseHealthCache: DependencyHealth | null = null;
let databaseHealthCacheExpiresAt = 0;

function timeoutAfter(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    const timeout = setTimeout(() => reject(new Error("database_health_timeout")), ms);
    timeout.unref();
  });
}

function buildDatabaseHealth(status: DependencyHealth["status"], startedAt: number, cached: boolean, timedOut = false): DependencyHealth {
  return {
    name: "database",
    status,
    checkedAt: new Date().toISOString(),
    latencyMs: Date.now() - startedAt,
    cached,
    ...(timedOut ? { timedOut: true } : {})
  };
}

export async function checkDatabaseHealth(): Promise<DependencyHealth> {
  const now = Date.now();
  if (databaseHealthCache && databaseHealthCacheExpiresAt > now) {
    return { ...databaseHealthCache, cached: true };
  }

  const startedAt = Date.now();
  try {
    await Promise.race([prisma.$queryRaw`SELECT 1`, timeoutAfter(DATABASE_HEALTH_TIMEOUT_MS)]);
    databaseHealthCache = buildDatabaseHealth("ok", startedAt, false);
  } catch (error) {
    databaseHealthCache = buildDatabaseHealth(
      "degraded",
      startedAt,
      false,
      error instanceof Error && error.message === "database_health_timeout"
    );
  }

  databaseHealthCacheExpiresAt = Date.now() + DATABASE_HEALTH_CACHE_TTL_MS;
  return databaseHealthCache;
}
