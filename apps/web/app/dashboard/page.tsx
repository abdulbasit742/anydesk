"use client";

import { Copy, KeyRound, Monitor, Plug, Rocket, Send } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { api } from "../../lib/api";
import { useAuthGuard } from "../../lib/useAuthGuard";
import { useAuthStore } from "../../lib/auth-store";

function formatId(id?: string) {
  return id ? id.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3") : "000 000 000";
}

export default function DashboardPage() {
  const { user, initialized } = useAuthGuard();
  const logout = useAuthStore((s) => s.logout);
  const [lookup, setLookup] = useState<any>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);

  if (!initialized) {
    return <main className="flex min-h-screen items-center justify-center"><p className="text-slate-500">Loading...</p></main>;
  }

  async function lookupDevice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const { data } = await api.get(`/users/lookup/${String(form.get("remoteDeskId")).replace(/\s/g, "")}`);
    setLookup(data.data);
  }

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await api.patch("/users/device-password", { password: String(form.get("password")) });
    setPasswordSaved(true);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="font-bold">RemoteDesk Console</div>
          <Button tone="secondary" onClick={logout}>Logout</Button>
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl gap-5 px-6 py-8 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Monitor className="h-6 w-6 text-brand-500" />
            <h1 className="text-lg font-semibold">Your address</h1>
          </div>
          <div className="mt-6 rounded-md bg-slate-950 p-6 text-center font-mono text-4xl font-bold tracking-wider text-white">
            {formatId(user?.remoteDeskId)}
          </div>
          <Button className="mt-4 w-full" tone="secondary" onClick={() => navigator.clipboard.writeText(user?.remoteDeskId ?? "")}>
            <Copy className="h-4 w-4" /> Copy ID
          </Button>
          <Link className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50" href="/dashboard/devices">
            Manage devices
          </Link>
          <Link className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50" href="/dashboard/launch">
            <Rocket className="h-4 w-4" /> Launch readiness
          </Link>
          <Link className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50" href="/dashboard/connectors">
            <Plug className="h-4 w-4" /> Connector catalog
          </Link>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Connect to remote desk</h2>
          <form onSubmit={lookupDevice} className="mt-5 flex gap-3">
            <Input name="remoteDeskId" placeholder="123 456 789" required />
            <Button type="submit"><Send className="h-4 w-4" /> Lookup</Button>
          </form>
          {lookup ? (
            <div className="mt-5 rounded-md border border-slate-200 p-4">
              <p className="font-semibold">{lookup.fullName}</p>
              <p className="text-sm text-slate-600">{formatId(lookup.remoteDeskId)} - {lookup.isOnline ? "Online" : "Offline"}</p>
            </div>
          ) : null}
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3">
            <KeyRound className="h-5 w-5 text-brand-500" />
            <h2 className="text-lg font-semibold">Device password</h2>
          </div>
          <form onSubmit={savePassword} className="mt-5 flex max-w-md gap-3">
            <Input name="password" type="password" minLength={4} placeholder="Set remote access password" required />
            <Button type="submit">Save</Button>
          </form>
          {passwordSaved ? <p className="mt-3 text-sm text-emerald-600">Password saved.</p> : null}
        </article>
      </section>
    </main>
  );
}
