import { and, desc, eq } from "drizzle-orm";
import { Card, Empty, PageHeader } from "@/components/workspace-ui";
import { db } from "@/server/db";
import { notifications } from "@/server/schema";
import { requireWorkspace } from "@/server/session";
import { dismissNotification } from "./actions";
export default async function Notifications(){const ctx=await requireWorkspace();const list=await db.select().from(notifications).where(and(eq(notifications.academyId,ctx.academy.id),eq(notifications.userId,ctx.user.id))).orderBy(desc(notifications.createdAt));const unread=list.filter(n=>!n.readAt).length;return <><PageHeader eyebrow="Inbox" title={`Notifications (${unread} unread)`} description="Account, invitation and billing events for your academy."/><Card>{list.length?list.map(n=><div key={n.id} className={`border-b py-4 ${n.readAt?'opacity-60':''}`}><strong>{n.title}</strong><p className="mt-1 text-sm text-slate-600">{n.body}</p>{!n.readAt&&<form action={dismissNotification}><input type="hidden" name="id" value={n.id}/><button className="mt-2 min-h-10 font-bold text-teal-700">Dismiss</button></form>}</div>):<Empty>No notifications.</Empty>}</Card></>}
