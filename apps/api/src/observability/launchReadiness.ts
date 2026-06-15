import {
  isLaunchBlocked,
  summarizeLaunchChecks,
  type LaunchCheck
} from "@remotedesk/shared/pack9/index.js";
import {
  certificationBlockers,
  supportReadinessMissing
} from "@remotedesk/shared/pack20/index.js";
import { coverageGatePassed } from "@remotedesk/shared/pack22/index.js";

const supportReadiness = {
  runbookPublished: true,
  macrosPublished: false,
  onCallAssigned: false,
  escalationPathTested: false
};

const releaseCertification = {
  smokePassed: false,
  securityPassed: false,
  performancePassed: false,
  docsPublished: true,
  supportReady: supportReadinessMissing(supportReadiness).length === 0
};

const qaCoverage = {
  actual: {
    statements: 0,
    branches: 0,
    functions: 0,
    lines: 0
  },
  minimum: {
    statements: 80,
    branches: 70,
    functions: 80,
    lines: 80
  }
};

const launchChecks: LaunchCheck[] = [
  {
    id: "api-health",
    area: "api",
    label: "API health endpoints are available",
    status: "pass",
    required: true
  },
  {
    id: "desktop-signing",
    area: "desktop",
    label: "Desktop production build is signed",
    status: "fail",
    required: true
  },
  {
    id: "e2e-smoke",
    area: "support",
    label: "End-to-end launch smoke suite has passed",
    status: "fail",
    required: true
  },
  {
    id: "billing-provider",
    area: "billing",
    label: "Billing provider production keys are verified",
    status: "warn",
    required: true
  },
  {
    id: "device-command-queue",
    area: "security",
    label: "Safe device command queue exists; desktop polling requires QA",
    status: "warn",
    required: true
  },
  {
    id: "release-certification",
    area: "deploy",
    label: "Release certification gates are satisfied",
    status: certificationBlockers(releaseCertification).length === 0 ? "pass" : "fail",
    required: true
  },
  {
    id: "qa-coverage-gate",
    area: "support",
    label: "QA coverage gate is satisfied",
    status: coverageGatePassed(qaCoverage.actual, qaCoverage.minimum) ? "pass" : "fail",
    required: true
  }
];

export const launchReadiness = {
  summary() {
    return {
      blocked: isLaunchBlocked(launchChecks),
      counts: summarizeLaunchChecks(launchChecks),
      releaseCertification: {
        blockers: certificationBlockers(releaseCertification),
        supportMissing: supportReadinessMissing(supportReadiness)
      },
      qaCoverage: {
        passed: coverageGatePassed(qaCoverage.actual, qaCoverage.minimum),
        actual: qaCoverage.actual,
        minimum: qaCoverage.minimum
      },
      checks: launchChecks
    };
  }
};
