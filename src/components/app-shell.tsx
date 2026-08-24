import Link from "next/link";
import { DarsFlowLogo } from "./darsflow-logo";
import { SignOutButton } from "./sign-out-button";

const nav = [["/app", "Home"], ["/app/lessons", "Lessons"], ["/app/students", "Students"], ["/app/classes", "Classes"], ["/app/teachers", "Team"], ["/app/reports", "Reports"], ["/app/billing", "Billing"], ["/app/settings", "Settings"]];

export function AppShell({ academyName, userName, role, children }: { academyName: string; userName: string; role: string; children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#f5f8f7] text-slate-900"><header className="sticky top-0 z-40 border-b border-slate-200 bg-white"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6"><Link href="/app"><DarsFlowLogo /></Link><div className="text-right"><p className="text-sm font-bold">{academyName}</p><p className="text-xs text-slate-500">{userName} · {role} · <SignOutButton /></p></div></div></header><div className="mx-auto grid max-w-7xl md:grid-cols-[220px_1fr]"><aside className="hidden min-h-[calc(100vh-4rem)] border-r border-slate-200 bg-white p-4 md:block"><nav className="space-y-1">{nav.map(([href, label]) => <Link key={href} href={href} className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-teal-50 hover:text-teal-800">{label}</Link>)}</nav></aside><main className="min-w-0 p-4 pb-24 sm:p-7 md:pb-8">{children}</main></div><nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white p-1 md:hidden">{nav.slice(0, 5).map(([href, label]) => <Link key={href} href={href} className="min-h-14 px-1 py-2 text-center text-[0.6875rem] font-bold text-slate-600">{label}</Link>)}</nav></div>;
}
