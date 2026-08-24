"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
export function SignOutButton(){const router=useRouter();return <button onClick={async()=>{await authClient.signOut();router.push("/");router.refresh();}} className="text-xs font-bold text-slate-500 hover:text-teal-700">Sign out</button>}
