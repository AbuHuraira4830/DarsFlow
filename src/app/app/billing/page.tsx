import { eq } from "drizzle-orm";
import { trialDaysRemaining } from "@/lib/saas";
import { submitPayment } from "../actions";
import { Card, Empty, PageHeader, button, input } from "@/components/workspace-ui";
import { db } from "@/server/db";
import { academySubscriptions, paymentRequests, platformSettings, subscriptionPlans } from "@/server/schema";
import { requireWorkspace } from "@/server/session";

export default async function Billing() {
  const ctx = await requireWorkspace();
  const subscription = db.select().from(academySubscriptions).where(eq(academySubscriptions.academyId, ctx.academy.id)).get();
  const plan = subscription ? db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, subscription.planId)).get() : null;
  const requests = db.select().from(paymentRequests).where(eq(paymentRequests.academyId, ctx.academy.id)).all();
  const settings = db.select().from(platformSettings).where(eq(platformSettings.id, "default")).get();
  const remaining = subscription?.trialEndsAt ? trialDaysRemaining(subscription.trialEndsAt) : 0;
  return <><PageHeader eyebrow="Subscription" title="Plan and billing" description="Plans are configurable by the platform operator. No payment is charged automatically." /><div className="grid gap-5 lg:grid-cols-2"><Card title={plan?.name ?? "No plan"} tone="mint"><p className="mt-3 text-3xl font-semibold">{remaining} days</p><p className="text-sm text-slate-500">Trial remaining · {plan?.activeStudentLimit ?? 0} students · {plan?.activeTeacherLimit ?? 0} teachers</p><p className="mt-4 text-sm">Status: <strong>{subscription?.status}</strong></p></Card><Card title="Manual payment review"><p className="mt-3 text-sm text-slate-600">{settings?.paymentInstructions || "Payment instructions have not been configured. Contact the DarsFlow operator before paying."}</p><form action={submitPayment} className="mt-4 space-y-3"><input name="reference" required placeholder="Payment reference" className={input} /><textarea name="note" placeholder="Optional note" className={`${input} py-3`} /><button className={button}>Request verification</button></form></Card></div><Card title="Payment requests">{requests.length ? <div className="mt-3 divide-y">{requests.map((request) => <p key={request.id} className="py-3 text-sm"><strong>{request.reference}</strong> · {request.status}</p>)}</div> : <Empty>No payment requests submitted.</Empty>}</Card></>;
}
