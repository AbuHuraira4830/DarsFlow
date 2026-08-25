import { AppShell } from "@/components/app-shell";
import { requireWorkspace } from "@/server/session";
import { and, count, eq, isNull } from "drizzle-orm";
import { db } from "@/server/db";
import { notifications } from "@/server/schema";
export default async function WorkspaceLayout({children}:{children:React.ReactNode}){const ctx=await requireWorkspace();const unread=(await db.select({n:count()}).from(notifications).where(and(eq(notifications.academyId,ctx.academy.id),eq(notifications.userId,ctx.user.id),isNull(notifications.readAt))).then(r=>r[0]))?.n??0;return <AppShell academyName={ctx.academy.name} userName={ctx.user.name} role={ctx.membership.role} unreadCount={unread}>{children}</AppShell>}
