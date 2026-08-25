"use server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { notifications } from "@/server/schema";
import { requireWorkspace } from "@/server/session";
export async function dismissNotification(form:FormData){const ctx=await requireWorkspace();await db.update(notifications).set({readAt:new Date().toISOString()}).where(and(eq(notifications.id,String(form.get("id"))),eq(notifications.academyId,ctx.academy.id),eq(notifications.userId,ctx.user.id)));redirect("/app/notifications")}
