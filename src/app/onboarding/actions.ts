"use server";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { academySchema } from "@/lib/saas";
import { db } from "@/server/db";
import { accessRequestActivities,accessRequests,academies, academySubscriptions, auditEvents, memberships, subscriptionPlans } from "@/server/schema";
import { requireUser } from "@/server/session";

export async function createAcademy(formData: FormData) {
  const current = await requireUser();
  const parsed = academySchema.safeParse({ name: formData.get("name"), timezone: formData.get("timezone"), tracks: formData.getAll("tracks"), supportPhone: formData.get("supportPhone") });
  if (!parsed.success) redirect("/onboarding?error=Please+complete+all+required+academy+details.");
  const existing = await db.select().from(memberships).where(eq(memberships.userId, current.user.id)).then((rows) => rows[0]);
  if(existing){const academy=await db.select().from(academies).where(eq(academies.id,existing.academyId)).then(r=>r[0]);if(academy?.onboardingComplete)redirect("/app");const stamp=new Date().toISOString();await db.transaction(async tx=>{await tx.update(academies).set({name:parsed.data.name,timezone:parsed.data.timezone,tracks:parsed.data.tracks,supportPhone:parsed.data.supportPhone||null,onboardingComplete:true,updatedAt:stamp}).where(eq(academies.id,existing.academyId));const lead=await tx.select().from(accessRequests).where(eq(accessRequests.academyId,existing.academyId)).then(r=>r[0]);if(lead){await tx.update(accessRequests).set({status:"onboarded",updatedAt:stamp}).where(eq(accessRequests.id,lead.id));await tx.insert(accessRequestActivities).values({id:crypto.randomUUID(),accessRequestId:lead.id,actorUserId:current.user.id,action:"academy.onboarded",detail:"Invitation accepted and academy setup completed.",occurredAt:stamp})}await tx.insert(auditEvents).values({id:crypto.randomUUID(),academyId:existing.academyId,actorUserId:current.user.id,action:"academy.onboarding_completed",entityType:"academy",entityId:existing.academyId,metadata:{},occurredAt:stamp})});redirect("/app")}
  const now = new Date(); const id = crypto.randomUUID(); const slugBase = parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 45) || "academy";
  const trial = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.name, "Trial")).then((rows) => rows[0]);
  if (!trial) throw new Error("Run npm run db:setup before onboarding.");
  await db.transaction(async (tx) => {
    await tx.insert(academies).values({ id, name: parsed.data.name, slug: `${slugBase}-${id.slice(0, 6)}`, timezone: parsed.data.timezone, tracks: parsed.data.tracks, supportPhone: parsed.data.supportPhone || null, status: "trial", onboardingComplete: true, createdAt: now.toISOString(), updatedAt: now.toISOString() });
    await tx.insert(memberships).values({ id: crypto.randomUUID(), academyId: id, userId: current.user.id, role: "owner", active: true, createdAt: now.toISOString(), updatedAt: now.toISOString() });
    await tx.insert(academySubscriptions).values({ id: crypto.randomUUID(), academyId: id, planId: trial.id, status: "trial", trialStartsAt: now.toISOString(), trialEndsAt: new Date(now.getTime() + 14 * 86400000).toISOString(), periodStartsAt: now.toISOString(), periodEndsAt: new Date(now.getTime() + 14 * 86400000).toISOString(), createdAt: now.toISOString(), updatedAt: now.toISOString() });
    await tx.insert(auditEvents).values({ id: crypto.randomUUID(), academyId: id, actorUserId: current.user.id, action: "academy.created", entityType: "academy", entityId: id, metadata: {}, occurredAt: now.toISOString() });
  });
  redirect("/app");
}
