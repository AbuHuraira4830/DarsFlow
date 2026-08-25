"use client";

import { useState } from "react";

type Guardian = { id: string; name: string; channel: string; url: string; valid: boolean };

export function ParentShareActions({ message, guardians }: { message: string; guardians: Guardian[] }) {
  const [notice, setNotice] = useState("");
  const canShare = typeof navigator !== "undefined" && "share" in navigator;

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setNotice("Copied.");
    } catch {
      setNotice("Copy failed. Select the message manually.");
    }
  }

  async function shareMessage() {
    try {
      await navigator.share({ title: "Lesson update", text: message });
      setNotice("Share sheet opened.");
    } catch {
      setNotice("Sharing was cancelled.");
    }
  }

  return (
    <div className="mt-4">
      <p className="text-sm font-bold">Recipients</p>
      <div className="mt-2 grid gap-2">
        {guardians.map((guardian) => (
          <div key={guardian.id} className="flex items-center justify-between rounded-lg border bg-white p-3 text-sm">
            <span><strong>{guardian.name}</strong> · {guardian.channel}</span>
            {guardian.valid ? <a href={guardian.url} target="_blank" rel="noreferrer" className="font-bold text-teal-700">Preview and open</a> : <span className="font-bold text-rose-700">Contact missing</span>}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={copyMessage} className="rounded-xl border bg-white px-4 py-3 text-sm font-bold">Copy</button>
        {canShare && <button type="button" onClick={shareMessage} className="rounded-xl border bg-white px-4 py-3 text-sm font-bold">Native share</button>}
      </div>
      <p aria-live="polite" className="mt-2 text-xs text-slate-500">{notice}</p>
      {message.length > 1800 && <p className="mt-2 rounded-lg bg-amber-50 p-3 text-xs font-semibold text-amber-900">This message is long for WhatsApp. Shorten the reviewed version before sharing.</p>}
    </div>
  );
}
