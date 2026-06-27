export interface DesktopUser {
  id: string;
  email: string;
  fullName: string;
  remoteDeskId: string;
  plan: string;
}

export interface AuthResult {
  user: DesktopUser;
  accessToken: string;
  refreshToken: string;
}

export interface DesktopDevice {
  id: string;
  userId: string;
  name: string;
  platform: string;
  remoteDeskId: string;
  remoteDeskIdFormatted: string;
  isOnline: boolean;
  lastSeenAt?: string | null;
  createdAt: string;
}

export interface DeviceCommand {
  id: string;
  deviceId: string;
  type: "refresh_policy" | "collect_diagnostics" | "check_update" | "sign_out";
  status: "pending" | "delivered" | "completed" | "failed" | "expired" | "canceled";
  payload?: Record<string, unknown> | null;
  result?: Record<string, unknown> | null;
  issuedAt: string;
  expiresAt: string;
  deliveredAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  failureReason?: string | null;
  createdAt: string;
  updatedAt: string;
  safe: boolean;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message ?? `Request failed: ${response.status}`);
  }
  return body.data as T;
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const data = await request<{ user: DesktopUser; tokens: { accessToken: string; refreshToken: string } }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  return {
    user: data.user,
    accessToken: data.tokens.accessToken,
    refreshToken: data.tokens.refreshToken
  };
}

export async function signup(input: { fullName: string; email: string; password: string }): Promise<AuthResult> {
  const data = await request<{ user: DesktopUser; tokens: { accessToken: string; refreshToken: string } }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return {
    user: data.user,
    accessToken: data.tokens.accessToken,
    refreshToken: data.tokens.refreshToken
  };
}

export async function loadMe(token: string): Promise<DesktopUser> {
  return request<DesktopUser>("/auth/me", {}, token);
}

export async function setDevicePassword(token: string, password: string): Promise<void> {
  await request("/users/device-password", {
    method: "PATCH",
    body: JSON.stringify({ password })
  }, token);
}

export async function lookupRemoteDesk(token: string, remoteDeskId: string) {
  return request<{ id: string; fullName: string; remoteDeskId: string; isOnline: boolean }>(
    `/users/lookup/${remoteDeskId.replace(/\s/g, "")}`,
    {},
    token
  );
}

export async function registerDevice(
  token: string,
  input: { name: string; platform: string; remoteDeskId?: string }
): Promise<DesktopDevice> {
  return request<DesktopDevice>(
    "/devices/register",
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    token
  );
}

export async function heartbeatDevice(token: string, deviceId: string): Promise<DesktopDevice> {
  return request<DesktopDevice>(
    `/devices/${deviceId}/heartbeat`,
    {
      method: "PATCH"
    },
    token
  );
}

export async function getPendingDeviceCommands(token: string, deviceId: string): Promise<DeviceCommand[]> {
  return request<DeviceCommand[]>(`/devices/${deviceId}/commands/pending`, {}, token);
}

export async function fetchIceConfig(token: string): Promise<{ urls: string; username?: string; credential?: string }[]> {
  const data = await request<{ iceServers: { urls: string; username?: string; credential?: string }[] }>("/ice/config", {}, token);
  return data.iceServers;
}

export async function updateDeviceCommand(
  token: string,
  deviceId: string,
  commandId: string,
  input: { status: DeviceCommand["status"]; result?: Record<string, unknown>; failureReason?: string }
): Promise<DeviceCommand> {
  return request<DeviceCommand>(
    `/devices/${deviceId}/commands/${commandId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input)
    },
    token
  );
}
