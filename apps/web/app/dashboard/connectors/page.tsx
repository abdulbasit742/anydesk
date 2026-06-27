"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, ExternalLink, Plug, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/Button";
import { api } from "../../../lib/api";
import { useAuthGuard } from "../../../lib/useAuthGuard";

type ConnectorInstallStatus = "available" | "installed" | "coming_soon";

interface ConnectorCatalogItem {
  key: string;
  name: string;
  category: string;
  availability: "available" | "coming_soon";
  description: string;
  capabilities: string[];
  docsUrl?: string;
  installStatus: ConnectorInstallStatus;
  installedAt?: string | null;
}

interface ConnectorAuditEvent {
  id: string;
  connectorKey: string;
  type: string;
  message: string;
  createdAt: string;
  connector?: {
    key: string;
    name: string;
    category: string;
  };
}

export default function ConnectorsPage() {
  const { initialized } = useAuthGuard();
  const [catalog, setCatalog] = useState<ConnectorCatalogItem[]>([]);
  const [auditEvents, setAuditEvents] = useState<ConnectorAuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadConnectors() {
    setLoading(true);
    setError("");

    try {
      const [catalogResponse, auditResponse] = await Promise.all([
        api.get("/connectors/catalog"),
        api.get("/connectors/audit")
      ]);
      setCatalog(catalogResponse.data.data);
      setAuditEvents(auditResponse.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load connectors");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialized) {
      void loadConnectors();
    }
  }, [initialized]);

  const installedCount = useMemo(
    () => catalog.filter((connector) => connector.installStatus === "installed").length,
    [catalog]
  );

  async function install(key: string) {
    setSaving(key);
    setError("");
    setMessage("");

    try {
      await api.post(`/connectors/${key}/install`);
      await loadConnectors();
      setMessage("Connector installed and audit event recorded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to install connector");
    } finally {
      setSaving("");
    }
  }

  async function uninstall(key: string) {
    setSaving(key);
    setError("");
    setMessage("");

    try {
      await api.delete(`/connectors/${key}/install`);
      await loadConnectors();
      setMessage("Connector uninstalled and audit event recorded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to uninstall connector");
    } finally {
      setSaving("");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-8">
        <Link className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950" href="/dashboard">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-brand-600">Enterprise integrations</p>
            <h1 className="text-2xl font-bold text-slate-950">Connector catalog</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Install safe notification and support connectors. OAuth secrets and provider calls stay out of the desktop client.
            </p>
          </div>
          <Button tone="secondary" onClick={() => void loadConnectors()} disabled={loading}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        {error ? <Notice tone="error" message={error} /> : null}
        {message ? <Notice tone="success" message={message} /> : null}
        {loading ? <Notice message="Loading connector catalog from the API." /> : null}

        <div className="grid gap-5">
          <section className="grid gap-3 md:grid-cols-3">
            <Metric label="Catalog entries" value={catalog.length} />
            <Metric label="Installed" value={installedCount} tone="success" />
            <Metric label="Audit events" value={auditEvents.length} />
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {catalog.map((connector) => (
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={connector.key}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                      <Plug className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-slate-950">{connector.name}</h2>
                        <StatusBadge status={connector.installStatus} />
                      </div>
                      <p className="mt-1 text-xs uppercase text-slate-500">{connector.category}</p>
                    </div>
                  </div>
                  {connector.docsUrl ? (
                    <a
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                      href={connector.docsUrl}
                      rel="noreferrer"
                      target="_blank"
                      title={`${connector.name} docs`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>

                <p className="mt-4 text-sm text-slate-600">{connector.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {connector.capabilities.map((capability) => (
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600" key={capability}>
                      {capability.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-500">
                    {connector.installedAt ? `Installed ${new Date(connector.installedAt).toLocaleString()}` : "Not installed"}
                  </p>
                  {connector.installStatus === "installed" ? (
                    <Button tone="secondary" onClick={() => void uninstall(connector.key)} disabled={saving === connector.key}>
                      Uninstall
                    </Button>
                  ) : (
                    <Button
                      onClick={() => void install(connector.key)}
                      disabled={saving === connector.key || connector.installStatus === "coming_soon"}
                    >
                      {connector.installStatus === "coming_soon" ? "Coming soon" : "Install"}
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-600" />
              <h2 className="font-semibold text-slate-950">Connector audit</h2>
            </div>
            {auditEvents.length === 0 ? (
              <p className="text-sm text-slate-500">No connector audit events yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {auditEvents.map((event) => (
                  <div className="flex flex-wrap items-center justify-between gap-3 py-3" key={event.id}>
                    <div>
                      <p className="text-sm font-medium text-slate-950">{event.message}</p>
                      <p className="text-xs text-slate-500">
                        {event.connector?.name ?? event.connectorKey} - {event.type}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500">{new Date(event.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, tone = "default" }: { label: string; value: number; tone?: "default" | "success" }) {
  const toneClass = tone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-white text-slate-900";

  return (
    <div className={`rounded-lg border border-slate-200 p-4 shadow-sm ${toneClass}`}>
      <p className="text-xs font-semibold uppercase">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: ConnectorInstallStatus }) {
  const tone =
    status === "installed"
      ? "bg-emerald-50 text-emerald-700"
      : status === "coming_soon"
        ? "bg-amber-50 text-amber-700"
        : "bg-slate-100 text-slate-600";
  const icon = status === "installed" ? <CheckCircle2 className="h-3.5 w-3.5" /> : null;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${tone}`}>
      {icon}
      {status.replace(/_/g, " ")}
    </span>
  );
}

function Notice({ message, tone = "default" }: { message: string; tone?: "default" | "error" | "success" }) {
  const toneClass =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : tone === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : "border-slate-200 bg-white text-slate-700";

  return <div className={`mb-4 rounded-lg border p-4 text-sm ${toneClass}`}>{message}</div>;
}
