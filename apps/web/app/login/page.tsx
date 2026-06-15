"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useAuthStore } from "../../lib/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await login(String(form.get("email")), String(form.get("password")));
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-2 text-sm text-slate-600">Access your RemoteDesk dashboard.</p>
        <label className="mt-6 block text-sm font-medium">Email</label>
        <Input name="email" type="email" required className="mt-2" />
        <label className="mt-4 block text-sm font-medium">Password</label>
        <Input name="password" type="password" required className="mt-2" />
        {error ? <p className="mt-4 text-sm text-brand-600">{error}</p> : null}
        <Button className="mt-6 w-full" type="submit">Login</Button>
        <p className="mt-4 text-center text-sm text-slate-600">
          No account? <Link className="font-semibold text-brand-600" href="/signup">Sign up</Link>
        </p>
      </form>
    </main>
  );
}
