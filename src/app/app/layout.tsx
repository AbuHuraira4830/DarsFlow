import { AppShell } from "@/components/app-shell";
import { requireWorkspace } from "@/server/session";
export default async function WorkspaceLayout({children}:{children:React.ReactNode}){const ctx=await requireWorkspace();return <AppShell academyName={ctx.academy.name} userName={ctx.user.name} role={ctx.membership.role}>{children}</AppShell>}
