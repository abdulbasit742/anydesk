"use client";

import Link from "next/link";
import { Monitor, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";
import { api } from "../../../lib/api";
import { useAuthGuard } from "../../../lib/useAuthGuard";

interface DeviceRow {
  id: string;
  name: string;
  platform: string;
  remoteDeskId: string;
  remoteDeskIdFormatted: string;
  isOnline: boolean;
  lastSeenAt?: string | null;
}

export default function DevicesPage() {
  const { initialized } = useAuthGuard();
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDevices() {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/devices");
      setDevices(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load devices");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialized) {
      void loadDevices();
    }
  }, [initialized]);

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-brand-600">Device management</p>
            <h1 className="text-2xl font-bold text-slate-950">Your devices</h1>
          </div>
          <Button tone="secondary" onClick={() => void loadDevices()}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        {loading ? <StateCard title="Loading devices" message="Fetching your registered RemoteDesk devices." /> : null}
        {error ? <StateCard title="Unable to load devices" message={error} tone="error" /> : null}
        {!loading && !error && devices.length === 0 ? (
          <StateCard title="No registered devices" message="Login from the desktop client to register a device here." />
        ) : null}

        <div className="grid gap-4">
          {devices.map((device) => (
            <Link
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md"
              href={`/dashboard/devices/${device.id}`}
              key={device.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-brand-50 p-2 text-brand-600">
                    <Monitor className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-semibold text-slate-950">{device.name}</h2>
                    <p className="text-sm text-slate-500">{device.platform}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${device.isOnline ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                  {device.isOnline ? "Online" : "Offline"}
                </span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <span>ID: <strong className="font-mono text-slate-900">{device.remoteDeskIdFormatted}</strong></span>
                <span>Last seen: {device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleString() : "Never"}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function StateCard({ title, message, tone = "default" }: { title: string; message: string; tone?: "default" | "error" }) {
  return (
    <div className={`rounded-lg border p-5 ${tone === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-slate-200 bg-white text-slate-700"}`}>
      <strong>{title}</strong>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
}
