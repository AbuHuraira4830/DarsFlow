import { count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { DarsFlowLogo } from "@/components/darsflow-logo";
import { Card, Empty, PageHeader, button, input } from "@/components/workspace-ui";
import { db } from "@/server/db";
import { academies, memberships, paymentRequests, platformSettings, students } from "@/server/schema";
import { isPlatformAdmin, requireUser } from "@/server/session";
import { reviewPayment, savePaymentInstructions } from "./actions";

export default async function Platform() {
  const session = await requireUser();
  if (!isPlatformAdmin(session.user.email)) redirect("/app");
  const academyList = await db.select().from(academies);
  const payments = await db.select().from(paymentRequests).where(eq(paymentRequests.status, "pending"));
  const settings = await db.select().from(platformSettings).where(eq(platformSettings.id, "default")).then((rows) => rows[0]);
  const studentCounts = await db.select({ academyId: students.academyId, n: count() }).from(students).groupBy(students.academyId);
  const memberCounts = await db.select({ academyId: memberships.academyId, n: count() }).from(memberships).groupBy(memberships.academyId);
  return <main className="min-h-screen bg-[#f5f8f7] p-5 sm:p-8"><div className="mx-auto max-w-6xl"><DarsFlowLogo/><div className="mt-8"><PageHeader eyebrow="Restricted platform administration" title="DarsFlow operations" description="Access is controlled only through PLATFORM_ADMIN_EMAILS; no default administrator password exists."/></div><div className="grid gap-5 lg:grid-cols-2"><Card title="Academies">{academyList.map((academy)=><div key={academy.id} className="border-b py-3"><strong>{academy.name}</strong><p className="text-xs text-slate-500">{academy.status} · {studentCounts.find(x=>x.academyId===academy.id)?.n??0} students · {memberCounts.find(x=>x.academyId===academy.id)?.n??0} members</p></div>)}</Card><Card title="Payment instructions" tone="sand"><form action={savePaymentInstructions}><textarea name="instructions" defaultValue={settings?.paymentInstructions??""} className={`${input} min-h-28 py-3`}/><button className={`${button} mt-3`}>Save instructions</button></form></Card></div><Card title="Pending payment verification">{payments.length?payments.map((payment)=><form action={reviewPayment} key={payment.id} className="mt-3 rounded-xl border p-4"><input type="hidden" name="id" value={payment.id}/><p><strong>{payment.reference}</strong> · academy {payment.academyId}</p><input name="reason" placeholder="Reason if rejected" className={input}/><div className="mt-3 flex gap-2"><button name="decision" value="approve" className={button}>Approve</button><button name="decision" value="reject" className="rounded-xl border px-4 font-bold">Reject</button></div></form>):<Empty>No payment requests awaiting review.</Empty>}</Card></div></main>;
}
