"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, RefreshCw, Rocket, ShieldAlert, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { api } from "../../../lib/api";
import { useAuthGuard } from "../../../lib/useAuthGuard";

type CheckStatus = "pass" | "warn" | "fail" | "not_applicable";

interface LaunchCheck {
  id: string;
  key: string;
  area: string;
  label: string;
  status: CheckStatus;
  required: boolean;
  notes?: string | null;
  updatedAt: string;
}

interface ReleaseCandidate {
  id: string;
  version: string;
  gitSha: string;
  status: string;
  signedDesktopBuild: boolean;
  migrationsReviewed: boolean;
  smokeTestsPassed: boolean;
  createdAt: string;
}

interface MigrationCheck {
  id: string;
  name: string;
  risk: string;
  status: string;
  destructive: boolean;
  backfillRows: number;
  reviewed: boolean;
  createdAt: string;
}

interface SupportEscalation {
  id: string;
  title: string;
  priority: string;
  category: string;
  target: string;
  status: string;
  createdAt: string;
}

interface LaunchSnapshot {
  blocked: boolean;
  counts: Record<CheckStatus, number>;
  checks: LaunchCheck[];
  releaseCandidates: ReleaseCandidate[];
  migrationChecks: MigrationCheck[];
  supportEscalations: SupportEscalation[];
}

const checkStatuses: CheckStatus[] = ["pass", "warn", "fail", "not_applicable"];

export default function LaunchReadinessPage() {
  useAuthGuard();
  const [snapshot, setSnapshot] = useState<LaunchSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadSnapshot() {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/launch/readiness");
      setSnapshot(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load launch readiness");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSnapshot();
  }, []);

  const requiredFailures = useMemo(
    () => snapshot?.checks.filter((check) => check.required && check.status === "fail") ?? [],
    [snapshot]
  );

  async function updateCheck(key: string, status: CheckStatus) {
    setSaving(key);
    setError("");
    setMessage("");

    try {
      const { data } = await api.patch(`/launch/checks/${key}`, { status });
      setSnapshot((prev) =>
        prev
          ? {
              ...prev,
              checks: prev.checks.map((check) => (check.key === key ? data.data : check))
            }
          : prev
      );
      await loadSnapshot();
      setMessage("Launch check updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update launch check");
    } finally {
      setSaving("");
    }
  }

  async function createReleaseCandidate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving("release");
    setError("");
    setMessage("");

    try {
      await api.post("/launch/release-candidates", {
        version: String(form.get("version")),
        gitSha: String(form.get("gitSha")),
        signedDesktopBuild: form.get("signedDesktopBuild") === "on",
        migrationsReviewed: form.get("migrationsReviewed") === "on",
        smokeTestsPassed: form.get("smokeTestsPassed") === "on",
        notes: String(form.get("notes") ?? "")
      });
      event.currentTarget.reset();
      await loadSnapshot();
      setMessage("Release candidate created.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create release candidate");
    } finally {
      setSaving("");
    }
  }

  async function createEscalation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving("escalation");
    setError("");
    setMessage("");

    try {
      await api.post("/launch/support-escalations", {
        title: String(form.get("title")),
        priority: String(form.get("priority")),
        category: String(form.get("category")),
        description: String(form.get("description") ?? "")
      });
      event.currentTarget.reset();
      await loadSnapshot();
      setMessage("Support escalation created.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create escalation");
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
            <p className="text-sm font-medium text-brand-600">Production operations</p>
            <h1 className="text-2xl font-bold text-slate-950">Launch readiness</h1>
            <p className="mt-1 text-sm text-slate-500">Track the real gates that must pass before RemoteDesk can ship.</p>
          </div>
          <Button tone="secondary" onClick={() => void loadSnapshot()} disabled={loading}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        {error ? <Notice tone="error" message={error} /> : null}
        {message ? <Notice tone="success" message={message} /> : null}
        {loading ? <Notice message="Loading launch readiness from the API." /> : null}

        {snapshot ? (
          <div className="grid gap-5">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`rounded-md p-3 ${snapshot.blocked ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {snapshot.blocked ? <ShieldAlert className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">
                      {snapshot.blocked ? "Launch is blocked" : "Launch gates are clear"}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {snapshot.blocked
                        ? `${requiredFailures.length} required check${requiredFailures.length === 1 ? "" : "s"} need attention.`
                        : "Required checks have no failing gate."}
                    </p>
                  </div>
                </div>
                <StatusBadge status={snapshot.blocked ? "blocked" : "ready"} />
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-4">
                <Metric label="Pass" value={snapshot.counts.pass} tone="pass" />
                <Metric label="Warn" value={snapshot.counts.warn} tone="warn" />
                <Metric label="Fail" value={snapshot.counts.fail} tone="fail" />
                <Metric label="N/A" value={snapshot.counts.not_applicable} />
              </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <Panel title="Launch checks">
                <div className="space-y-3">
                  {snapshot.checks.map((check) => (
                    <div className="rounded-md border border-slate-200 p-4" key={check.id}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <strong className="text-sm text-slate-950">{check.label}</strong>
                            {check.required ? <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">Required</span> : null}
                          </div>
                          <p className="mt-1 text-xs uppercase text-slate-500">{check.area} / {check.key}</p>
                          {check.notes ? <p className="mt-2 text-sm text-slate-500">{check.notes}</p> : null}
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={check.status} />
                          <select
                            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-brand-500/20 focus:ring-4"
                            disabled={saving === check.key}
                            onChange={(event) => void updateCheck(check.key, event.target.value as CheckStatus)}
                            value={check.status}
                          >
                            {checkStatuses.map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Create release candidate">
                <form className="space-y-3" onSubmit={createReleaseCandidate}>
                  <Input name="version" placeholder="v0.1.0-rc.1" required />
                  <Input name="gitSha" placeholder="Git SHA" minLength={7} required />
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input name="signedDesktopBuild" type="checkbox" /> Signed desktop build
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input name="migrationsReviewed" type="checkbox" /> Migrations reviewed
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input name="smokeTestsPassed" type="checkbox" /> Smoke tests passed
                  </label>
                  <textarea
                    className="min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500/20 focus:ring-4"
                    name="notes"
                    placeholder="Release notes or blockers"
                  />
                  <Button className="w-full" type="submit" disabled={saving === "release"}>
                    <Rocket className="h-4 w-4" /> Create candidate
                  </Button>
                </form>
              </Panel>
            </section>

            <section className="grid gap-5 lg:grid-cols-2">
              <Panel title="Recent release candidates">
                {snapshot.releaseCandidates.length === 0 ? (
                  <p className="text-sm text-slate-500">No release candidates have been created yet.</p>
                ) : (
                  <div className="space-y-3">
                    {snapshot.releaseCandidates.map((candidate) => (
                      <div className="rounded-md border border-slate-200 p-4" key={candidate.id}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <strong className="text-sm text-slate-950">{candidate.version}</strong>
                            <p className="text-xs text-slate-500">{candidate.gitSha} - {new Date(candidate.createdAt).toLocaleString()}</p>
                          </div>
                          <StatusBadge status={candidate.status} />
                        </div>
                        <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
                          <span>Signed: {candidate.signedDesktopBuild ? "yes" : "no"}</span>
                          <span>Migrations: {candidate.migrationsReviewed ? "reviewed" : "pending"}</span>
                          <span>Smoke: {candidate.smokeTestsPassed ? "passed" : "pending"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel title="Migration gates">
                {snapshot.migrationChecks.length === 0 ? (
                  <p className="text-sm text-slate-500">No migration reviews have been logged yet.</p>
                ) : (
                  <div className="space-y-3">
                    {snapshot.migrationChecks.map((check) => (
                      <div className="rounded-md border border-slate-200 p-4" key={check.id}>
                        <div className="flex items-center justify-between gap-3">
                          <strong className="text-sm text-slate-950">{check.name}</strong>
                          <StatusBadge status={check.risk} />
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                          {check.status} - {check.destructive ? "destructive" : "non-destructive"} - {check.backfillRows.toLocaleString()} rows
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </section>

            <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <Panel title="Create support escalation">
                <form className="space-y-3" onSubmit={createEscalation}>
                  <Input name="title" placeholder="Escalation title" required />
                  <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-brand-500/20 focus:ring-4" name="priority" defaultValue="normal">
                    <option value="low">low</option>
                    <option value="normal">normal</option>
                    <option value="high">high</option>
                    <option value="urgent">urgent</option>
                  </select>
                  <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none ring-brand-500/20 focus:ring-4" name="category" defaultValue="connection">
                    <option value="connection">connection</option>
                    <option value="billing">billing</option>
                    <option value="security">security</option>
                    <option value="desktop_crash">desktop crash</option>
                    <option value="data_loss">data loss</option>
                    <option value="other">other</option>
                  </select>
                  <textarea
                    className="min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500/20 focus:ring-4"
                    name="description"
                    placeholder="What needs attention?"
                  />
                  <Button className="w-full" type="submit" disabled={saving === "escalation"}>
                    <TriangleAlert className="h-4 w-4" /> Create escalation
                  </Button>
                </form>
              </Panel>

              <Panel title="Open support escalations">
                {snapshot.supportEscalations.length === 0 ? (
                  <p className="text-sm text-slate-500">No open escalations.</p>
                ) : (
                  <div className="space-y-3">
                    {snapshot.supportEscalations.map((item) => (
                      <div className="rounded-md border border-slate-200 p-4" key={item.id}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <strong className="text-sm text-slate-950">{item.title}</strong>
                            <p className="text-xs text-slate-500">{item.category} routed to {item.target}</p>
                          </div>
                          <StatusBadge status={item.priority} />
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                          {item.status} - {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </section>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-semibold text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

function Metric({ label, value, tone = "default" }: { label: string; value: number; tone?: "pass" | "warn" | "fail" | "default" }) {
  const toneClass =
    tone === "pass"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "warn"
        ? "bg-amber-50 text-amber-700"
        : tone === "fail"
          ? "bg-red-50 text-red-700"
          : "bg-slate-50 text-slate-700";

  return (
    <div className={`rounded-md p-4 ${toneClass}`}>
      <p className="text-xs font-semibold uppercase">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    ["pass", "ready", "approved", "promotable", "low"].includes(status)
      ? "bg-emerald-50 text-emerald-700"
      : ["warn", "pending", "medium", "normal", "draft"].includes(status)
        ? "bg-amber-50 text-amber-700"
        : ["fail", "blocked", "rejected", "high", "urgent", "critical"].includes(status)
          ? "bg-red-50 text-red-700"
          : "bg-slate-100 text-slate-600";

  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tone}`}>{status.replace(/_/g, " ")}</span>;
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
