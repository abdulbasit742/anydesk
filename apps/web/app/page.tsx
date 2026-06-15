import Link from "next/link";
import { ArrowRight, MonitorUp, ShieldCheck, Workflow } from "lucide-react";

const features = [
  { icon: MonitorUp, title: "Remote desktop", text: "Stream screens over WebRTC with low-latency peer connections." },
  { icon: ShieldCheck, title: "Permission first", text: "Device passwords, accepted sessions, and auditable connection history." },
  { icon: Workflow, title: "SaaS ready", text: "Plans, users, sessions, signaling, and desktop client are split cleanly." }
];

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="text-lg font-bold">RemoteDesk</div>
          <div className="flex items-center gap-3">
            <Link className="text-sm font-medium text-slate-600" href="/login">Login</Link>
            <Link className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white" href="/signup">Start free</Link>
          </div>
        </nav>
      </section>

      <section className="mx-auto grid min-h-[620px] max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-600">Remote access SaaS</p>
          <h1 className="max-w-3xl text-5xl font-bold leading-tight text-slate-950 md:text-6xl">RemoteDesk</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            A practical AnyDesk-style starter with auth, device IDs, signaling, session history,
            billing hooks, and an Electron desktop client foundation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="inline-flex h-11 items-center gap-2 rounded-md bg-brand-500 px-5 text-sm font-semibold text-white" href="/signup">
              Create account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link className="inline-flex h-11 items-center rounded-md border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800" href="/dashboard">
              Open dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="rounded-md bg-slate-950 p-4 text-white">
            <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm font-semibold">Live session</span>
              <span className="rounded bg-emerald-500/15 px-2 py-1 text-xs text-emerald-300">Connected</span>
            </div>
            <div className="grid gap-3">
              <div className="h-28 rounded bg-slate-800" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-20 rounded bg-slate-800" />
                <div className="h-20 rounded bg-slate-800" />
                <div className="h-20 rounded bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-16 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-lg border border-slate-200 bg-white p-6">
            <feature.icon className="mb-4 h-6 w-6 text-brand-500" />
            <h2 className="font-semibold text-slate-950">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
