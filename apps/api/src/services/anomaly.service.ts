import { prisma } from "../lib/prisma.js";

export type AnomalySeverity = "minor" | "moderate" | "critical";
export type AnomalyType = "cpu" | "memory_leak" | "disk_fill" | "network_spike" | "login_pattern";

export interface AnomalyEvent {
  id: string;
  deviceId: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  score: number;
  metric: string;
  observedValue: number;
  expectedValue: number;
  rootCauseHint: string | null;
  dismissed: boolean;
  falsePositive: boolean;
  createdAt: string;
}

interface AnomalyEventRow {
  id: string;
  deviceId: string;
  type: string;
  severity: string;
  score: number;
  metric: string;
  observedValue: number;
  expectedValue: number;
  rootCauseHint: string | null;
  dismissed: boolean;
  falsePositive: boolean;
  createdAt: Date;
}

interface AnomalyBaselineRow {
  deviceId: string;
  metric: string;
  mean: number;
  stdDev: number;
  sampleCount: number;
  updatedAt: Date;
}

function serialize(row: AnomalyEventRow): AnomalyEvent {
  return {
    id: row.id,
    deviceId: row.deviceId,
    type: row.type as AnomalyType,
    severity: row.severity as AnomalySeverity,
    score: row.score,
    metric: row.metric,
    observedValue: row.observedValue,
    expectedValue: row.expectedValue,
    rootCauseHint: row.rootCauseHint,
    dismissed: row.dismissed,
    falsePositive: row.falsePositive,
    createdAt: row.createdAt.toISOString()
  };
}

function severityFromScore(score: number): AnomalySeverity {
  if (score >= 0.9) return "critical";
  if (score >= 0.6) return "moderate";
  return "minor";
}

function rootCauseHint(type: AnomalyType): string {
  const hints: Record<AnomalyType, string> = {
    cpu: "Check top processes; possible runaway task or build job.",
    memory_leak: "Steadily rising RSS; inspect long-lived process for leaks.",
    disk_fill: "Rapid disk growth; check logs/temp/cache directories.",
    network_spike: "Unusual egress; verify backups, sync, or exfil.",
    login_pattern: "Off-baseline auth; review source IPs and times."
  };
  return hints[type];
}

async function findBaseline(deviceId: string, metric: string): Promise<AnomalyBaselineRow | null> {
  const rows = await prisma.$queryRaw<AnomalyBaselineRow[]>`
    SELECT "deviceId", metric, mean, "stdDev", "sampleCount", "updatedAt"
    FROM "AnomalyBaseline"
    WHERE "deviceId" = ${deviceId} AND metric = ${metric}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function updateBaseline(deviceId: string, metric: string, value: number): Promise<void> {
  const existing = await findBaseline(deviceId, metric);

  if (!existing) {
    await prisma.$executeRaw`
      INSERT INTO "AnomalyBaseline" (id, "deviceId", metric, mean, "stdDev", "sampleCount", "updatedAt")
      VALUES (gen_random_uuid()::text, ${deviceId}, ${metric}, ${value}, 0, 1, now())
    `;
    return;
  }

  const n = existing.sampleCount + 1;
  const delta = value - existing.mean;
  const mean = existing.mean + delta / n;
  const variance = (existing.stdDev * existing.stdDev * existing.sampleCount + delta * (value - mean)) / n;
  const stdDev = Math.sqrt(Math.max(variance, 0));

  await prisma.$executeRaw`
    UPDATE "AnomalyBaseline"
    SET mean = ${mean}, "stdDev" = ${stdDev}, "sampleCount" = ${n}, "updatedAt" = now()
    WHERE "deviceId" = ${deviceId} AND metric = ${metric}
  `;
}

export async function evaluateSample(input: {
  deviceId: string;
  type: AnomalyType;
  metric: string;
  value: number;
}): Promise<AnomalyEvent | null> {
  const baseline = await findBaseline(input.deviceId, input.metric);
  await updateBaseline(input.deviceId, input.metric, input.value);

  if (!baseline || baseline.sampleCount < 30 || baseline.stdDev === 0) return null;

  const z = Math.abs(input.value - baseline.mean) / baseline.stdDev;
  if (z < 3) return null;

  const score = Math.min(1, z / 6);
  const severity = severityFromScore(score);
  const hint = rootCauseHint(input.type);
  const created = await prisma.$queryRaw<AnomalyEventRow[]>`
    INSERT INTO "AnomalyEvent" (
      id, "deviceId", type, severity, score, metric, "observedValue", "expectedValue", "rootCauseHint", dismissed, "falsePositive", "createdAt"
    )
    VALUES (
      gen_random_uuid()::text, ${input.deviceId}, ${input.type}, ${severity}, ${score}, ${input.metric}, ${input.value}, ${baseline.mean}, ${hint}, false, false, now()
    )
    RETURNING id, "deviceId", type, severity, score, metric, "observedValue", "expectedValue", "rootCauseHint", dismissed, "falsePositive", "createdAt"
  `;

  return created[0] ? serialize(created[0]) : null;
}

export async function listAnomalies(deviceId?: string): Promise<AnomalyEvent[]> {
  const rows = deviceId
    ? await prisma.$queryRaw<AnomalyEventRow[]>`
        SELECT id, "deviceId", type, severity, score, metric, "observedValue", "expectedValue", "rootCauseHint", dismissed, "falsePositive", "createdAt"
        FROM "AnomalyEvent"
        WHERE dismissed = false AND "deviceId" = ${deviceId}
        ORDER BY "createdAt" DESC
        LIMIT 200
      `
    : await prisma.$queryRaw<AnomalyEventRow[]>`
        SELECT id, "deviceId", type, severity, score, metric, "observedValue", "expectedValue", "rootCauseHint", dismissed, "falsePositive", "createdAt"
        FROM "AnomalyEvent"
        WHERE dismissed = false
        ORDER BY "createdAt" DESC
        LIMIT 200
      `;

  return rows.map(serialize);
}

export async function dismissAnomaly(id: string, falsePositive: boolean): Promise<void> {
  await prisma.$executeRaw`
    UPDATE "AnomalyEvent"
    SET dismissed = true, "falsePositive" = ${falsePositive}
    WHERE id = ${id}
  `;
}
