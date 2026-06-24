import { launchReadiness } from "./launchReadiness.js";

const startedAt = Date.now();
let ready = false;
let readinessReason = "starting";
let readinessChangedAt = new Date(startedAt).toISOString();

function setReadiness(nextReady: boolean, reason: string) {
  ready = nextReady;
  readinessReason = reason;
  readinessChangedAt = new Date().toISOString();
}

export const health = {
  markReady(reason = "ready") {
    setReadiness(true, reason);
  },
  markNotReady(reason = "not_ready") {
    setReadiness(false, reason);
  },
  liveness() {
    return {
      status: "ok" as const,
      service: "remotedesk-api",
      uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
      time: new Date().toISOString()
    };
  },
  readiness() {
    return {
      status: ready ? ("ready" as const) : ("not_ready" as const),
      ready,
      reason: readinessReason,
      readinessChangedAt,
      service: "remotedesk-api",
      launchReadiness: launchReadiness.summary(),
      uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
      time: new Date().toISOString()
    };
  }
};
