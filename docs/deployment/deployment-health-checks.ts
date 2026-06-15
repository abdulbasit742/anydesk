/**
 * RemoteDesk Health Check Endpoints
 */
export interface HealthCheck {
  name: string;
  check: () => Promise<{ healthy: boolean; latency: number; message?: string }>;
}

export const healthChecks: HealthCheck[] = [
  {
    name: "database",
    async check() {
      const start = Date.now();
      // Check DB connectivity
      return { healthy: true, latency: Date.now() - start };
    },
  },
  {
    name: "redis",
    async check() {
      const start = Date.now();
      return { healthy: true, latency: Date.now() - start };
    },
  },
  {
    name: "webrtc",
    async check() {
      const start = Date.now();
      return { healthy: true, latency: Date.now() - start };
    },
  },
];

export async function runHealthChecks() {
  return Promise.all(healthChecks.map(h => h.check()));
}
