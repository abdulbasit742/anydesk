import type { DeviceAccessPolicySnapshot, DeviceTrustStatus } from "@shared/index";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

interface DevicePolicyApiResponse {
  id: string;
  settings?: {
    trust?: {
      status?: string;
    };
    accessPolicy?: {
      unattendedAccessEnabled?: boolean;
      remoteInputEnabled?: boolean;
      clipboardSyncEnabled?: boolean;
      fileTransferEnabled?: boolean;
      requiresSessionApproval?: boolean;
      maxSessionMinutes?: number | null;
      updatedAt?: string;
    };
  };
}

export interface DevicePolicyLoadResult {
  policy: DeviceAccessPolicySnapshot | null;
  fromCache: boolean;
  error?: string;
}

const policyCache = new Map<string, DeviceAccessPolicySnapshot>();

export async function fetchDeviceAccessPolicy(token: string, deviceId: string): Promise<DevicePolicyLoadResult> {
  try {
    const response = await fetch(`${API_URL}/devices/${deviceId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(body?.message ?? `Policy request failed: ${response.status}`);
    }

    const device = (body?.data ?? body) as DevicePolicyApiResponse;
    const policy = mapDevicePolicy(device);
    policyCache.set(deviceId, policy);
    return { policy, fromCache: false };
  } catch (err) {
    const cached = policyCache.get(deviceId) ?? null;
    return {
      policy: cached,
      fromCache: cached !== null,
      error: err instanceof Error ? err.message : "Unable to load device policy"
    };
  }
}

function mapDevicePolicy(device: DevicePolicyApiResponse): DeviceAccessPolicySnapshot {
  const accessPolicy = device.settings?.accessPolicy;

  return {
    deviceId: device.id,
    trustStatus: normalizeTrustStatus(device.settings?.trust?.status),
    unattendedAccessEnabled: Boolean(accessPolicy?.unattendedAccessEnabled),
    remoteInputEnabled: Boolean(accessPolicy?.remoteInputEnabled),
    clipboardSyncEnabled: Boolean(accessPolicy?.clipboardSyncEnabled),
    fileTransferEnabled: Boolean(accessPolicy?.fileTransferEnabled),
    requiresSessionApproval: accessPolicy?.requiresSessionApproval ?? true,
    maxSessionMinutes:
      typeof accessPolicy?.maxSessionMinutes === "number" && Number.isFinite(accessPolicy.maxSessionMinutes)
        ? accessPolicy.maxSessionMinutes
        : null,
    updatedAt: accessPolicy?.updatedAt ?? new Date().toISOString()
  };
}

function normalizeTrustStatus(value?: string): DeviceTrustStatus {
  if (value === "trusted" || value === "blocked") return value;
  return "untrusted";
}
