"use client";
import { FormEvent, useEffect, useState } from "react";
import { Laptop, LogOut, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { PasswordInput } from "./password-input";
type SafeSession = {
  token: string;
  id: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};
export function AccountSecurity() {
  const [sessions, setSessions] = useState<SafeSession[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function refresh() {
    const result = await authClient.listSessions();
    setSessions((result.data ?? []) as SafeSession[]);
  }
  useEffect(() => {
    let active = true;
    authClient.listSessions().then((result) => {
      if (active) setSessions((result.data ?? []) as SafeSession[]);
    });
    return () => { active = false; };
  }, []);
  async function revoke(token: string) {
    setBusy(true);
    const result = await authClient.revokeSession({ token });
    setMessage(
      result.error ? "Session could not be revoked." : "Session revoked.",
    );
    await refresh();
    setBusy(false);
  }
  async function revokeOthers() {
    setBusy(true);
    const result = await authClient.revokeOtherSessions();
    setMessage(
      result.error
        ? "Other sessions could not be revoked."
        : "Other sessions revoked.",
    );
    await refresh();
    setBusy(false);
  }
  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const data = new FormData(event.currentTarget);
    const result = await authClient.changePassword({
      currentPassword: String(data.get("currentPassword")),
      newPassword: String(data.get("newPassword")),
      revokeOtherSessions: true,
    });
    setMessage(
      result.error
        ? (result.error.message ?? "Password could not be changed.")
        : "Password changed and other sessions revoked.",
    );
    if (!result.error) event.currentTarget.reset();
    await refresh();
    setBusy(false);
  }
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-sky-50 text-sky-700">
            <Laptop className="size-5" />
          </span>
          <div>
            <h2 className="font-bold">Active sessions</h2>
            <p className="text-sm text-slate-500">
              Devices currently signed in to your account.
            </p>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {sessions.map((session, index) => (
            <div
              key={session.id}
              className="rounded-xl border border-slate-200 p-4 text-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <strong>
                    {index === 0 ? "Current session" : "Other session"}
                  </strong>
                  <p className="mt-1 break-words text-slate-500">
                    {session.userAgent || "Unknown device"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Active {new Date(session.updatedAt).toLocaleString()}
                  </p>
                </div>
                {index > 0 && (
                  <button
                    disabled={busy}
                    onClick={() => revoke(session.token)}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 font-bold text-rose-700 hover:bg-rose-50"
                  >
                    <LogOut className="size-4" />
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          disabled={busy}
          onClick={revokeOthers}
          className="mt-4 min-h-11 rounded-xl border border-slate-300 px-4 font-bold hover:bg-slate-50"
        >
          Revoke all other sessions
        </button>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <h2 className="font-bold">Change password</h2>
            <p className="text-sm text-slate-500">
              Other sessions are revoked after a successful change.
            </p>
          </div>
        </div>
        <form onSubmit={changePassword} className="mt-5 space-y-4">
          <PasswordInput
            name="currentPassword"
            label="Current password"
            autoComplete="current-password"
          />
          <PasswordInput
            name="newPassword"
            label="New password"
            autoComplete="new-password"
            help="Use at least 10 characters."
          />
          <button
            disabled={busy}
            className="min-h-12 rounded-xl bg-teal-700 px-5 font-bold text-white disabled:opacity-60"
          >
            {busy ? "Updating…" : "Change password"}
          </button>
        </form>
        <p aria-live="polite" className="mt-3 text-sm text-slate-600">
          {message}
        </p>
      </section>
    </div>
  );
}
