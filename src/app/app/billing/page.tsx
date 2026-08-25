import { eq } from "drizzle-orm";
import { trialDaysRemaining } from "@/lib/saas";
import { submitPayment } from "../actions";
import { Card, Empty, PageHeader, button, input } from "@/components/workspace-ui";
import { db } from "@/server/db";
import { academySubscriptions, paymentRequests, platformSettings, subscriptionPlans } from "@/server/schema";
import { requireWorkspace } from "@/server/session";

export default async function Billing({ searchParams }: { searchParams: Promise<{ error?: string; submitted?: string }> }) {
  const ctx = await requireWorkspace();
  const query = await searchParams;
  const subscription = await db.select().from(academySubscriptions).where(eq(academySubscriptions.academyId, ctx.academy.id)).then((rows) => rows[0]);
  const plan = subscription ? await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, subscription.planId)).then((rows) => rows[0]) : null;
  const requests = await db.select().from(paymentRequests).where(eq(paymentRequests.academyId, ctx.academy.id));
  const settings = await db.select().from(platformSettings).where(eq(platformSettings.id, "default")).then((rows) => rows[0]);
  const remaining = subscription?.trialEndsAt ? trialDaysRemaining(subscription.trialEndsAt) : 0;

  return <>
    <PageHeader eyebrow="Subscription" title="Plan and billing" description="Manual pilot billing: DarsFlow never charges automatically." />
    {query.error && <p role="alert" className="mb-4 rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-800">{query.error}</p>}
    {query.submitted && <p role="status" className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">Payment submitted for operator review.</p>}
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title={plan?.name ?? "No plan"} tone="mint">
        <p className="mt-3 text-3xl font-semibold">{remaining} days</p>
        <p className="text-sm text-slate-500">Trial remaining · {plan?.activeStudentLimit ?? 0} students · {plan?.activeTeacherLimit ?? 0} teachers</p>
        <p className="mt-4 text-sm">Status: <strong>{subscription?.status ?? "not configured"}</strong></p>
      </Card>
      <Card title="Submit a manual payment" tone="blue">
        <p className="mt-3 text-sm text-slate-600">{settings?.paymentInstructions || "Payment instructions have not been configured. Contact the DarsFlow operator before paying."}</p>
        <form action={submitPayment} className="mt-4 space-y-3">
          <label className="block text-sm font-bold">Transaction reference<input name="reference" required className={input} /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-bold">Amount<input name="amount" required min="0.01" step="0.01" inputMode="decimal" className={input} /></label>
            <label className="block text-sm font-bold">Currency<select name="currency" className={input}><option>PKR</option><option>GBP</option><option>USD</option></select></label>
          </div>
          <label className="block text-sm font-bold">Payment date<input name="paidAt" required type="date" className={input} /></label>
          <label className="block text-sm font-bold">Optional note<textarea name="note" className={`${input} py-3`} /></label>
          <button className={button}>Request verification</button>
        </form>
      </Card>
    </div>
    <Card title="Payment requests">
      {requests.length ? <div className="mt-3 grid gap-3">{requests.map((request) => <div key={request.id} className="rounded-lg border bg-white p-3 text-sm"><strong>{request.reference}</strong><p>{request.currency} {(request.amountMinor / 100).toFixed(2)} · {request.status}</p></div>)}</div> : <Empty>No payment requests submitted.</Empty>}
    </Card>
  </>;
}
