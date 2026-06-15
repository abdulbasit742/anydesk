import type { DesktopAuditEvent } from '../types/audit.js';
import type { DiagnosticsState } from '../state/diagnosticsStore.js';

export interface SupportBundleInput {
  sessionId: string;
  deviceId: string;
  createdAt?: string;
  diagnostics: DiagnosticsState;
  auditEvents?: DesktopAuditEvent[];
  appVersion?: string;
  platform?: string;
  extra?: Record<string, unknown>;
}

const SECRET_KEYS = ['token', 'password', 'secret', 'authorization', 'cookie', 'clipboard'];

export function redactSupportBundleValue(key: string, value: unknown): unknown {
  if (SECRET_KEYS.some((secret) => key.toLowerCase().includes(secret))) return '[redacted]';
  if (typeof value === 'string' && value.length > 4096) return `${value.slice(0, 4096)}…[truncated]`;
  if (Array.isArray(value)) return value.map((item, index) => redactSupportBundleValue(String(index), item));
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [childKey, redactSupportBundleValue(childKey, childValue)]));
  }
  return value;
}

export function buildSupportBundle(input: SupportBundleInput): string {
  const bundle = {
    kind: 'remotedesk.desktop.support_bundle',
    createdAt: input.createdAt ?? new Date().toISOString(),
    sessionId: input.sessionId,
    deviceId: input.deviceId,
    appVersion: input.appVersion,
    platform: input.platform ?? navigator.platform,
    diagnostics: input.diagnostics,
    auditEvents: input.auditEvents ?? [],
    extra: input.extra ?? {},
  };
  return JSON.stringify(redactSupportBundleValue('bundle', bundle), null, 2);
}

export async function exportSupportBundle(input: SupportBundleInput): Promise<{ accepted: boolean; path?: string }> {
  const json = buildSupportBundle(input);
  return window.remoteDeskDiagnostics?.exportSupportBundle({ fileName: `remotedesk-support-${input.sessionId}.json`, json }) ?? { accepted: false };
}
