"use client";

import Link from "next/link";
import { ArrowLeft, Ban, Clock, Monitor, Send, ShieldCheck, ShieldOff } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Button } from "../../../../components/Button";
import { api } from "../../../../lib/api";

interface DeviceDetailResponse {
  device: {
    id: string;
    name: string;
    platform: string;
    remoteDeskId: string;
    remoteDeskIdFormatted: string;
    isOnline: boolean;
    lastSeenAt?: string | null;
    createdAt: string;
  };
  sessions: Array<{
    id: string;
    status: string;
    startedAt?: string | null;
    endedAt?: string | null;
    duration?: number | null;
    createdAt: string;
    host: { fullName: string; remoteDeskId: string };
    client: { fullName: string; remoteDeskId: string };
  }>;
  timeline: Array<{ id: string; type: string; message: string; at: string }>;
  commands: Array<{
    id: string;
    type: string;
    status: string;
    safe: boolean;
    issuedAt: string;
    expiresAt: string;
    deliveredAt?: string | null;
    completedAt?: string | null;
    failedAt?: string | null;
    failureReason?: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  settings: {
    trust: {
      status: "trusted" | "untrusted" | "blocked";
      trusted: boolean;
      blocked: boolean;
      reason?: string | null;
      trustedAt?: string | null;
      revokedAt?: string | null;
      updatedAt: string;
    };
    accessPolicy: {
      unattendedAccessEnabled: boolean;
      remoteInputEnabled: boolean;
      clipboardSyncEnabled: boolean;
      fileTransferEnabled: boolean;
      requiresSessionApproval: boolean;
      maxSessionMinutes: number;
      updatedAt: string;
    };
    unattendedAccess: { enabled: boolean; reason: string };
    remoteInputPolicy: { enabled: boolean; reason: string };
    deviceCommands: {
      allowed: Array<{ id: string; type: string; expiresAt: string; safe: boolean }>;
      blocked: string[];
      reason: string;
    };
  };
}

export default function DeviceDetailPage({ params }: { params: { deviceId: string } }) {
  const [detail, setDetail] = useState<DeviceDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [issuingCommand, setIssuingCommand] = useState("");
  const [savingSetting, setSavingSetting] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get(`/devices/${params.deviceId}`);
        setDetail(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load device");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [params.deviceId]);

  async function issueDeviceCommand(type: string) {
    setIssuingCommand(type);
    setError("");

    try {
      const { data } = await api.post(`/devices/${params.deviceId}/commands`, {
        type,
        ttlSeconds: 300
      });
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              commands: [data.data, ...prev.commands].slice(0, 20),
              timeline: [
                {
                  id: `${data.data.id}:queued`,
                  type: "device.command.issued",
                  message: `${type.replace(/_/g, " ")} command queued`,
                  at: data.data.createdAt ?? new Date().toISOString()
                },
                ...prev.timeline
              ]
            }
          : prev
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to queue command");
    } finally {
      setIssuingCommand("");
    }
  }

  function mergeSettings(settings: DeviceDetailResponse["settings"]) {
    setDetail((prev) =>
      prev
        ? {
            ...prev,
            settings,
            timeline: [
              {
                id: `settings:${Date.now()}`,
                type: "device.settings.updated",
                message: "Device security settings updated",
                at: new Date().toISOString()
              },
              ...prev.timeline
            ]
          }
        : prev
    );
  }

  async function updateTrust(status: "trusted" | "untrusted" | "blocked") {
    setSavingSetting(`trust:${status}`);
    setError("");

    try {
      const { data } = await api.patch(`/devices/${params.deviceId}/trust`, {
        status,
        reason:
          status === "trusted"
            ? "Trusted from dashboard device detail"
            : status === "blocked"
              ? "Blocked from dashboard device detail"
              : "Trust revoked from dashboard device detail"
      });
      mergeSettings({ ...detail!.settings, ...data.data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update device trust");
    } finally {
      setSavingSetting("");
    }
  }

  async function updateAccessPolicy(patch: Partial<DeviceDetailResponse["settings"]["accessPolicy"]>) {
    setSavingSetting(Object.keys(patch)[0] ?? "accessPolicy");
    setError("");

    try {
      const { data } = await api.patch(`/devices/${params.deviceId}/access-policy`, patch);
      mergeSettings({ ...detail!.settings, ...data.data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update access policy");
    } finally {
      setSavingSetting("");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-8">
        <Link className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950" href="/dashboard/devices">
          <ArrowLeft className="h-4 w-4" /> Back to devices
        </Link>

        {loading ? <Panel title="Loading">Fetching device details.</Panel> : null}
        {error ? <Panel title="Unable to load device" tone="error">{error}</Panel> : null}

        {detail ? (
          <div className="grid gap-5">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-brand-50 p-3 text-brand-600">
                    <Monitor className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-brand-600">Device detail</p>
                    <h1 className="text-2xl font-bold text-slate-950">{detail.device.name}</h1>
                    <p className="text-sm text-slate-500">{detail.device.platform}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${detail.device.isOnline ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                  {detail.device.isOnline ? "Online" : "Offline"}
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Metric label="RemoteDesk ID" value={detail.device.remoteDeskIdFormatted} />
                <Metric label="Last seen" value={detail.device.lastSeenAt ? new Date(detail.device.lastSeenAt).toLocaleString() : "Never"} />
                <Metric label="Registered" value={new Date(detail.device.createdAt).toLocaleDateString()} />
              </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <Panel title="Per-device session history">
                {detail.sessions.length === 0 ? (
                  <p className="text-sm text-slate-500">No sessions recorded for this account yet.</p>
                ) : (
                  <div className="space-y-3">
                    {detail.sessions.map((session) => (
                      <div className="rounded-md border border-slate-200 p-4" key={session.id}>
                        <div className="flex items-center justify-between gap-3">
                          <strong className="text-sm text-slate-950">{session.status}</strong>
                          <span className="text-xs text-slate-500">{new Date(session.startedAt ?? session.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                          {session.host.fullName} to {session.client.fullName}
                          {session.duration ? ` - ${Math.round(session.duration / 60)} min` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel title="Device audit timeline">
                <div className="space-y-3">
                  {detail.timeline.map((item) => (
                    <div className="flex gap-3" key={item.id}>
                      <span className="mt-1 rounded-full bg-slate-100 p-1 text-slate-500">
                        <Clock className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.message}</p>
                        <p className="text-xs text-slate-500">{item.type} - {new Date(item.at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </section>

            <Panel title="Security and unattended access">
              <div className="grid gap-4 lg:grid-cols-3">
                <SettingCard
                  title="Device trust"
                  enabled={detail.settings.trust.trusted}
                  status={detail.settings.trust.status}
                  description={detail.settings.trust.reason ?? "Trust must be explicit before unattended access can be enabled."}
                >
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      disabled={savingSetting === "trust:trusted" || detail.settings.trust.trusted}
                      onClick={() => void updateTrust("trusted")}
                      tone="secondary"
                    >
                      <ShieldCheck className="h-4 w-4" /> Trust
                    </Button>
                    <Button
                      disabled={savingSetting === "trust:untrusted" || detail.settings.trust.status === "untrusted"}
                      onClick={() => void updateTrust("untrusted")}
                      tone="secondary"
                    >
                      <ShieldOff className="h-4 w-4" /> Untrust
                    </Button>
                    <Button
                      disabled={savingSetting === "trust:blocked" || detail.settings.trust.blocked}
                      onClick={() => void updateTrust("blocked")}
                      tone="secondary"
                    >
                      <Ban className="h-4 w-4" /> Block
                    </Button>
                  </div>
                </SettingCard>
                <SettingCard
                  title="Unattended access"
                  enabled={detail.settings.unattendedAccess.enabled}
                  status={detail.settings.unattendedAccess.enabled ? "enabled" : "disabled"}
                  description={detail.settings.unattendedAccess.reason}
                >
                  <Button
                    className="mt-4"
                    disabled={
                      savingSetting === "unattendedAccessEnabled" ||
                      (!detail.settings.accessPolicy.unattendedAccessEnabled && !detail.settings.trust.trusted)
                    }
                    onClick={() =>
                      void updateAccessPolicy({
                        unattendedAccessEnabled: !detail.settings.accessPolicy.unattendedAccessEnabled
                      })
                    }
                    tone="secondary"
                  >
                    {detail.settings.accessPolicy.unattendedAccessEnabled ? "Disable" : "Enable"}
                  </Button>
                </SettingCard>
                <SettingCard
                  title="Remote input policy"
                  enabled={detail.settings.remoteInputPolicy.enabled}
                  status={detail.settings.remoteInputPolicy.enabled ? "enabled" : "disabled"}
                  description={detail.settings.remoteInputPolicy.reason}
                >
                  <Button
                    className="mt-4"
                    disabled={savingSetting === "remoteInputEnabled" || detail.settings.trust.blocked}
                    onClick={() =>
                      void updateAccessPolicy({
                        remoteInputEnabled: !detail.settings.accessPolicy.remoteInputEnabled
                      })
                    }
                    tone="secondary"
                  >
                    {detail.settings.accessPolicy.remoteInputEnabled ? "Disable" : "Enable"}
                  </Button>
                </SettingCard>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <PolicyToggle
                  label="Clipboard sync"
                  enabled={detail.settings.accessPolicy.clipboardSyncEnabled}
                  disabled={savingSetting === "clipboardSyncEnabled" || detail.settings.trust.blocked}
                  onToggle={() =>
                    void updateAccessPolicy({
                      clipboardSyncEnabled: !detail.settings.accessPolicy.clipboardSyncEnabled
                    })
                  }
                />
                <PolicyToggle
                  label="File transfer"
                  enabled={detail.settings.accessPolicy.fileTransferEnabled}
                  disabled={savingSetting === "fileTransferEnabled" || detail.settings.trust.blocked}
                  onToggle={() =>
                    void updateAccessPolicy({
                      fileTransferEnabled: !detail.settings.accessPolicy.fileTransferEnabled
                    })
                  }
                />
                <PolicyToggle
                  label="Require session approval"
                  enabled={detail.settings.accessPolicy.requiresSessionApproval}
                  disabled={savingSetting === "requiresSessionApproval"}
                  onToggle={() =>
                    void updateAccessPolicy({
                      requiresSessionApproval: !detail.settings.accessPolicy.requiresSessionApproval
                    })
                  }
                />
              </div>
            </Panel>

            <Panel title="Safe device commands">
              <p className="mb-4 text-sm text-slate-500">{detail.settings.deviceCommands.reason}</p>
              <div className="grid gap-3 md:grid-cols-2">
                {detail.settings.deviceCommands.allowed.map((command) => (
                  <div className="rounded-md border border-slate-200 p-4" key={command.id}>
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm text-slate-950">{command.type.replace(/_/g, " ")}</strong>
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${command.safe ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                        {command.safe ? "Safe" : "Blocked"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Expires {new Date(command.expiresAt).toLocaleTimeString()}</p>
                    <Button
                      className="mt-3"
                      disabled={!command.safe || issuingCommand === command.type}
                      onClick={() => void issueDeviceCommand(command.type)}
                      tone="secondary"
                    >
                      <Send className="h-4 w-4" />
                      {issuingCommand === command.type ? "Queueing" : "Queue command"}
                    </Button>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Blocked command classes: {detail.settings.deviceCommands.blocked.join(", ")}
              </p>
            </Panel>

            <Panel title="Recent command queue">
              {detail.commands.length === 0 ? (
                <p className="text-sm text-slate-500">No device commands have been queued yet.</p>
              ) : (
                <div className="space-y-3">
                  {detail.commands.map((command) => (
                    <div className="rounded-md border border-slate-200 p-4" key={command.id}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <strong className="text-sm text-slate-950">{command.type.replace(/_/g, " ")}</strong>
                          <p className="text-xs text-slate-500">
                            Issued {new Date(command.issuedAt).toLocaleString()} - Expires {new Date(command.expiresAt).toLocaleString()}
                          </p>
                        </div>
                        <StatusPill status={command.status} />
                      </div>
                      {command.failureReason ? <p className="mt-2 text-sm text-red-700">{command.failureReason}</p> : null}
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function Panel({ title, children, tone = "default" }: { title: string; children: ReactNode; tone?: "default" | "error" }) {
  return (
    <section className={`rounded-lg border p-5 shadow-sm ${tone === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-slate-200 bg-white text-slate-700"}`}>
      <h2 className="mb-4 font-semibold text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function SettingCard({
  title,
  enabled,
  description,
  status,
  children
}: {
  title: string;
  enabled: boolean;
  description: string;
  status?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-md border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-brand-600" />
          <strong className="text-sm text-slate-950">{title}</strong>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
          {status ?? (enabled ? "Enabled" : "Disabled")}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-500">{description}</p>
      {children}
    </div>
  );
}

function PolicyToggle({
  label,
  enabled,
  disabled,
  onToggle
}: {
  label: string;
  enabled: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">{label}</p>
          <p className="mt-1 text-xs text-slate-500">{enabled ? "Allowed by saved policy" : "Blocked by saved policy"}</p>
        </div>
        <Button disabled={disabled} onClick={onToggle} tone="secondary">
          {enabled ? "Disable" : "Enable"}
        </Button>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "completed"
      ? "bg-emerald-50 text-emerald-700"
      : status === "failed" || status === "expired" || status === "canceled"
        ? "bg-red-50 text-red-700"
        : status === "delivered"
          ? "bg-blue-50 text-blue-700"
          : "bg-amber-50 text-amber-700";

  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
}
