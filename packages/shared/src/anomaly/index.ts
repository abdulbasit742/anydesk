export type AnomalySeverity = "minor" | "moderate" | "critical";

export type AnomalyType =
  | "cpu"
  | "memory_leak"
  | "disk_fill"
  | "network_spike"
  | "login_pattern";

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

export interface AnomalyBaseline {
  deviceId: string;
  metric: string;
  mean: number;
  stdDev: number;
  sampleCount: number;
  updatedAt: string;
}

export interface DismissAnomalyInput {
  anomalyId: string;
  falsePositive: boolean;
}

export interface AnomalySampleInput {
  deviceId: string;
  type: AnomalyType;
  metric: string;
  value: number;
}

export interface AnomalyServerToClientEvents {
  "anomaly:new": (event: AnomalyEvent) => void;
  "anomaly:resolved": (anomalyId: string) => void;
}
