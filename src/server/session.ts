import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { auth } from "./auth";
import { db } from "./db";
import { academies, memberships } from "./schema";

export async function requireUser() {
  const current = await auth.api.getSession({ headers: await headers() });
  if (!current) redirect("/login");
  return current;
}
export async function requireWorkspace() {
  const current = await requireUser();
  const membership = db.select().from(memberships).where(and(eq(memberships.userId, current.user.id), eq(memberships.active, true))).get();
  if (!membership) redirect("/onboarding");
  const academy = db.select().from(academies).where(eq(academies.id, membership.academyId)).get();
  if (!academy?.onboardingComplete) redirect("/onboarding");
  return { ...current, membership, academy };
}
export function isPlatformAdmin(email: string) {
  return (process.env.PLATFORM_ADMIN_EMAILS ?? "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean).includes(email.toLowerCase());
}
