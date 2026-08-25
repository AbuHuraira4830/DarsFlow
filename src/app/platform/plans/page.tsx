import { count } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, PageHeader, button, input } from "@/components/workspace-ui";
import { db } from "@/server/db";
import {
  academies,
  academySubscriptions,
  subscriptionPlans,
} from "@/server/schema";
import { isPlatformAdmin, requireUser } from "@/server/session";
import { changeAcademySubscription, savePlan } from "../actions";
import {FormSelect} from "@/components/server-form-controls";
export default async function Plans() {
  const session = await requireUser();
  if (!isPlatformAdmin(session.user.email)) notFound();
  const plans = await db.select().from(subscriptionPlans);
  const academyList = await db.select().from(academies);
  const subscribers = await db
    .select({ planId: academySubscriptions.planId, n: count() })
    .from(academySubscriptions)
    .groupBy(academySubscriptions.planId);
  return (
    <main className="mx-auto max-w-6xl p-5">
      <PageHeader
        eyebrow="Platform administration"
        title="Plans and entitlements"
        description="Prices and payment details remain operator-configured; DarsFlow never charges automatically."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.id}
              title={`${plan.name} · ${subscribers.find((x) => x.planId === plan.id)?.n ?? 0} academies`}
          >
            <PlanForm plan={plan} />
          </Card>
        ))}
        <Card title="Create plan" tone="mint">
          <PlanForm />
        </Card>
      </div>
      <Card title="Academy subscription controls">
        {academyList.map((academy) => (
          <form
            action={changeAcademySubscription}
            key={academy.id}
            className="grid gap-2 border-b py-4 sm:grid-cols-4"
          >
            <input type="hidden" name="academyId" value={academy.id} />
            <strong>{academy.name}</strong>
            <FormSelect name="subscriptionAction" label="Subscription action" defaultValue="extend_trial" options={[{value:"extend_trial",label:"Extend trial"},{value:"grace",label:"Grant grace"},{value:"suspend",label:"Suspend"},{value:"reactivate",label:"Reactivate"}]}/>
            <input
              name="days"
              type="number"
              min="1"
              defaultValue="7"
              className={input}
            />
            <input
              name="reason"
              required
              placeholder="Reason"
              className={input}
            />
            <button className={`${button} sm:col-span-4`}>
              Apply documented change
            </button>
          </form>
        ))}
      </Card>
    </main>
  );
}
function PlanForm({ plan }: { plan?: typeof subscriptionPlans.$inferSelect }) {
  return (
    <form action={savePlan} className="mt-3 grid gap-3 sm:grid-cols-2">
      {plan && <input type="hidden" name="id" value={plan.id} />}
      <Field name="name" label="Name" value={plan?.name} />
      <Field
        name="description"
        label="Description"
        value={plan?.description ?? undefined}
      />
      <Field
        name="price"
        label="Monthly price"
        value={plan?.priceMinor != null ? String(plan.priceMinor / 100) : "0"}
      />
      <Field name="currency" label="Currency" value={plan?.currency ?? "PKR"} />
      <Field
        name="studentLimit"
        label="Student limit"
        value={String(plan?.activeStudentLimit ?? 20)}
      />
      <Field
        name="teacherLimit"
        label="Teacher limit"
        value={String(plan?.activeTeacherLimit ?? 5)}
      />
      <Field
        name="trialDays"
        label="Trial days"
        value={String(plan?.trialDays ?? 14)}
      />
      <Field
        name="graceDays"
        label="Grace days"
        value={String(plan?.graceDays ?? 7)}
      />
      <FormSelect name="active" label="Availability" defaultValue={String(plan?.active??true)} options={[{value:"true",label:"Active"},{value:"false",label:"Inactive"}]}/>
      <button className={`${button} sm:col-span-2`}>Save plan</button>
    </form>
  );
}
function Field({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value?: string;
}) {
  return (
    <label className="text-sm font-bold">
      {label}
      <input name={name} required defaultValue={value} className={input} />
    </label>
  );
}
