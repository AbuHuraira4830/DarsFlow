"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const result = mode === "register"
      ? await authClient.signUp.email({ name: String(data.get("name") ?? "").trim(), email, password })
      : await authClient.signIn.email({ email, password });
    if (result.error) { setError(result.error.message ?? "Authentication failed."); setBusy(false); return; }
    router.push(mode === "register" ? "/onboarding" : "/app"); router.refresh();
  }
  return <form onSubmit={submit} className="mt-8 space-y-5">
    {mode === "register" && <Field name="name" label="Your name" autoComplete="name" />}
    <Field name="email" label="Email address" type="email" autoComplete="email" />
    <Field name="password" label="Password" type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} help={mode === "register" ? "Use at least 10 characters." : undefined} />
    {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">{error}</p>}
    <button disabled={busy} className="min-h-12 w-full rounded-xl bg-teal-700 px-5 font-bold text-white transition hover:bg-teal-800 disabled:opacity-60">{busy ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}</button>
  </form>;
}
function Field({ name, label, type = "text", autoComplete, help }: { name: string; label: string; type?: string; autoComplete: string; help?: string }) {
  return <label className="block text-sm font-bold text-slate-700">{label}<input required name={name} type={type} autoComplete={autoComplete} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10" />{help && <span className="mt-1 block text-xs font-normal text-slate-500">{help}</span>}</label>;
}
