import {
  canPromoteReleaseCandidate,
  chooseEscalationTarget,
  classifyMigrationRisk,
  isLaunchBlocked,
  summarizeLaunchChecks,
  type EscalationInput,
  type LaunchCheck,
  type LaunchCheckStatus,
  type MigrationRiskInput,
  type ReleaseCandidate
} from "@remotedesk/shared/pack9";
import { prisma } from "./prisma.js";

export type LaunchCheckArea = LaunchCheck["area"];

export const defaultLaunchChecks: Array<LaunchCheck & { key: string; notes: string }> = [
  {
    id: "api-health",
    key: "api-health",
    area: "api",
    label: "API health and readiness endpoints are available",
    status: "pass",
    required: true,
    notes: "/health/live and /health/ready are wired"
  },
  {
    id: "desktop-signing",
    key: "desktop-signing",
    area: "desktop",
    label: "Desktop production build is signed and packaged",
    status: "fail",
    required: true,
    notes: "Requires signed Electron build verification"
  },
  {
    id: "e2e-smoke",
    key: "e2e-smoke",
    area: "support",
    label: "Two-client remote desktop smoke test has passed",
    status: "fail",
    required: true,
    notes: "Needs host/viewer QA on real devices"
  },
  {
    id: "billing-provider",
    key: "billing-provider",
    area: "billing",
    label: "Billing provider production keys are verified",
    status: "warn",
    required: true,
    notes: "Stripe/Paddle production checkout is still a launch gate"
  },
  {
    id: "device-command-queue",
    key: "device-command-queue",
    area: "security",
    label: "Safe device command queue is persisted and audited",
    status: "warn",
    required: true,
    notes: "Queue exists; needs end-to-end desktop polling QA"
  },
  {
    id: "support-escalation",
    key: "support-escalation",
    area: "support",
    label: "Support escalation records are persisted",
    status: "pass",
    required: false,
    notes: "Launch operations API stores escalation targets"
  }
];

export async function ensureDefaultLaunchChecks(createdByUserId: string) {
  await Promise.all(
    defaultLaunchChecks.map((check) =>
      prisma.launchCheck.upsert({
        where: { key: check.key },
        update: {},
        create: {
          key: check.key,
          area: check.area,
          label: check.label,
          status: check.status,
          required: check.required,
          notes: check.notes,
          createdByUserId
        }
      })
    )
  );
}

export function toSharedLaunchCheck(check: {
  key: string;
  area: string;
  label: string;
  status: string;
  required: boolean;
}): LaunchCheck {
  return {
    id: check.key,
    area: check.area as LaunchCheckArea,
    label: check.label,
    status: check.status as LaunchCheckStatus,
    required: check.required
  };
}

export function summarizePersistedLaunchChecks(
  checks: Array<{ key: string; area: string; label: string; status: string; required: boolean }>
) {
  const sharedChecks = checks.map(toSharedLaunchCheck);
  return {
    blocked: isLaunchBlocked(sharedChecks),
    counts: summarizeLaunchChecks(sharedChecks)
  };
}

export function classifyPersistedMigrationRisk(input: MigrationRiskInput) {
  return classifyMigrationRisk(input);
}

export function deriveReleaseCandidateStatus(candidate: ReleaseCandidate) {
  return canPromoteReleaseCandidate(candidate).ok ? "promotable" : "blocked";
}

export function deriveEscalationTarget(input: EscalationInput) {
  return chooseEscalationTarget(input);
}
