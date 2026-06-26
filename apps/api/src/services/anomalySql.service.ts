import { randomUUID } from "node:crypto";
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

interface EventRow {
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

interface BaselineRow {
  mean: number;
  stdDev: number;
  sampleCount: number;
}

function serialize(row: EventRow): AnomalyEvent {
  return { ...row, type: row.type as AnomalyType, severity: row.severity as AnomalySeverity, createdAt: row.createdAt.toISOString() };
}

function severity(score: number): AnomalySeverity {
  if (score >= 0.9) return "critical";
  if (score >= 0.6) return "moderate";
  return "minor";
}

function hint(type: AnomalyType): string {
  const hints: Record<AnomalyType, string> = {
    cpu: "Check top processes; possible runaway task or build job.",
    memory_leak: "Steadily rising RSS; inspect long-lived process for leaks.",
    disk_fill: "Rapid disk growth; check logs, temp, and cache directories.",
    network_spike: "Unusual network change; verify backup, sync, or update jobs.",
    login_pattern: "Off-baseline auth; review source IPs and times."
  };
  return hints[type];
}

async function baseline(deviceId: string, metric: string): Promise<BaselineRow | null> {
  const rows = await prisma.$queryRaw<BaselineRow[]>`
    SELECT mean, "stdDev", "sampleCount" FROM "AnomalyBaseline"
    WHERE "deviceId" = ${deviceId} AND metric = ${metric}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function updateBaseline(deviceId: string, metric: string, value: number): Promise<void> {
  const current = await baseline(deviceId, metric);
  if (!current) {
    await prisma.$executeRaw`
      INSERT INTO "AnomalyBaseline" (id, "deviceId", metric, mean, "stdDev", "sampleCount", "updatedAt")
      VALUES (${randomUUID()}, ${deviceId}, ${metric}, ${value}, 0, 1, now())
    `;
    return;
  }

  const n = current.sampleCount + 1;
  const delta = value - current.mean;
  const mean = current.mean + delta / n;
  const variance = (current.stdDev * current.stdDev * current.sampleCount + delta * (value - mean)) / n;
  await prisma.$executeRaw`
    UPDATE "AnomalyBaseline"
    SET mean = ${mean}, "stdDev" = ${Math.sqrt(Math.max(variance, 0))}, "sampleCount" = ${n}, "updatedAt" = now()
    WHERE "deviceId" = ${deviceId} AND metric = ${metric}
  `;
}

export async function evaluateSample(input: { deviceId: string; type: AnomalyType; metric: string; value: number }): Promise<AnomalyEvent | null> {
  const current = await baseline(input.deviceId, input.metric);
  await updateBaseline(input.deviceId, input.metric, input.value);
  if (!current || current.sampleCount < 30 || current.stdDev === 0) return null;

  const z = Math.abs(input.value - current.mean) / current.stdDev;
  if (z < 3) return null;

  const score = Math.min(1, z / 6);
  const created = await prisma.$queryRaw<EventRow[]>`
    INSERT INTO "AnomalyEvent" (id, "deviceId", type, severity, score, metric, "observedValue", "expectedValue", "rootCauseHint", dismissed, "falsePositive", "createdAt")
    VALUES (${randomUUID()}, ${input.deviceId}, ${input.type}, ${severity(score)}, ${score}, ${input.metric}, ${input.value}, ${current.mean}, ${hint(input.type)}, false, false, now())
    RETURNING id, "deviceId", type, severity, score, metric, "observedValue", "expectedValue", "rootCauseHint", dismissed, "falsePositive", "createdAt"
  `;
  return created[0] ? serialize(created[0]) : null;
}

export async function listAnomalies(deviceId?: string): Promise<AnomalyEvent[]> {
  const rows = deviceId
    ? await prisma.$queryRaw<EventRow[]>`SELECT id, "deviceId", type, severity, score, metric, "observedValue", "expectedValue", "rootCauseHint", dismissed, "falsePositive", "createdAt" FROM "AnomalyEvent" WHERE dismissed = false AND "deviceId" = ${deviceId} ORDER BY "createdAt" DESC LIMIT 200`
    : await prisma.$queryRaw<EventRow[]>`SELECT id, "deviceId", type, severity, score, metric, "observedValue", "expectedValue", "rootCauseHint", dismissed, "falsePositive", "createdAt" FROM "AnomalyEvent" WHERE dismissed = false ORDER BY "createdAt" DESC LIMIT 200`;
  return rows.map(serialize);
}

export async function dismissAnomaly(id: string, falsePositive: boolean): Promise<void> {
  await prisma.$executeRaw`UPDATE "AnomalyEvent" SET dismissed = true, "falsePositive" = ${falsePositive} WHERE id = ${id}`;
}
