import os from "node:os";
import { clearInterval, setInterval } from "node:timers";

type AnomalyType = "cpu" | "memory_leak";

interface CollectorConfig {
  deviceId: string;
  apiUrl: string;
  token: string;
  intervalMs?: number;
}

interface Sample {
  type: AnomalyType;
  metric: string;
  value: number;
}

let previousCpu: { idle: number; total: number } | null = null;

function cpuUsagePercent(): number {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;

  for (const cpu of cpus) {
    idle += cpu.times.idle;
    total += cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq;
  }

  if (!previousCpu) {
    previousCpu = { idle, total };
    return 0;
  }

  const idleDelta = idle - previousCpu.idle;
  const totalDelta = total - previousCpu.total;
  previousCpu = { idle, total };

  if (totalDelta <= 0) return 0;
  return Math.max(0, Math.min(100, (1 - idleDelta / totalDelta) * 100));
}

function memUsagePercent(): number {
  const total = os.totalmem();
  const free = os.freemem();
  return total > 0 ? ((total - free) / total) * 100 : 0;
}

function collectSamples(): Sample[] {
  return [
    { type: "cpu", metric: "cpu.usage", value: cpuUsagePercent() },
    { type: "memory_leak", metric: "mem.usage", value: memUsagePercent() }
  ];
}

async function postSample(config: CollectorConfig, sample: Sample): Promise<void> {
  try {
    await fetch(`${config.apiUrl}/api/anomalies/sample`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.token}`
      },
      body: JSON.stringify({ deviceId: config.deviceId, ...sample })
    });
  } catch (error) {
    console.error("[anomalyCollector] sample failed:", error);
  }
}

export function startAnomalyCollector(config: CollectorConfig): () => void {
  const handle = setInterval(() => {
    for (const sample of collectSamples()) void postSample(config, sample);
  }, config.intervalMs ?? 15_000);

  return () => clearInterval(handle);
}
