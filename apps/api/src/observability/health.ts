import { launchReadiness } from "./launchReadiness.js";

const startedAt = Date.now();
let ready = false;

export const health = {
  markReady() {
    ready = true;
  },
  markNotReady() {
    ready = false;
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
      service: "remotedesk-api",
      launchReadiness: launchReadiness.summary(),
      time: new Date().toISOString()
    };
  }
};
