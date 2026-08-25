import Link from "next/link";
import { DarsFlowLogo } from "@/components/darsflow-logo";
import { AuthForm } from "@/components/auth-form";
import {env} from "@/server/env";
export default function LoginPage() { const privatePilot=env.PILOT_MODE==="invitation_only";return <AuthPage title="Welcome back" text="Sign in to your academy workspace."><AuthForm mode="login" /><p className="mt-6 text-center text-sm text-slate-600">{privatePilot?<>Joining an academy? <Link href="/register" className="font-bold text-teal-700">Use your invitation</Link></>:<>New to DarsFlow? <Link href="/register" className="font-bold text-teal-700">Create an account</Link></>}</p></AuthPage>; }
function AuthPage({ title, text, children }: { title: string; text: string; children: React.ReactNode }) { return <main className="grid min-h-screen place-items-center bg-[#f4f8f7] p-5"><section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-9"><Link href="/"><DarsFlowLogo /></Link><h1 className="mt-8 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1><p className="mt-2 text-slate-600">{text}</p>{children}</section></main>; }
