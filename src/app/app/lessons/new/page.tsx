import { eq } from "drizzle-orm";
import { recordLesson } from "../../actions";
import { Card, PageHeader, button, input } from "@/components/workspace-ui";
import { db } from "@/server/db";
import { students } from "@/server/schema";
import { requireWorkspace } from "@/server/session";
import {FormDatePicker,FormSelect} from "@/components/server-form-controls";

export default async function NewLesson({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const ctx = await requireWorkspace();
  const list = await db
    .select()
    .from(students)
    .where(eq(students.academyId, ctx.academy.id));
  const q = await searchParams;
  return (
    <>
      <PageHeader
        eyebrow="Teacher workflow"
        title="Record a lesson"
        description="Save unfinished work safely, or complete the lesson to create individual review drafts."
      />
      {q.error && (
        <p className="mb-4 rounded-xl bg-rose-50 p-3 font-bold text-rose-800">
          {q.error}
        </p>
      )}
      <Card>
        <form action={recordLesson} className="grid gap-5 sm:grid-cols-2">
          <input
            type="hidden"
            name="idempotencyKey"
            value={crypto.randomUUID()}
          />
          <FormSelect
            name="studentId"
            label="Student"
            options={list.map((s) => ({value:s.id,label:s.displayName}))}
            placeholder="Choose a student"
          />
          <FormDatePicker name="lessonDate" label="Lesson date" defaultValue={new Date().toISOString().slice(0,10)} maxValue={new Date().toISOString().slice(0,10)}/>
          <FormSelect
            name="attendance"
            label="Attendance"
            options={["Attended", "Late", "Absent", "Excused"].map(value=>({value,label:value}))}
            placeholder="Choose attendance"
          />
          <FormSelect
            name="engagement"
            label="Engagement"
            options={[
              "Excellent",
              "Good",
              "Needed encouragement",
              "Frequently distracted",
            ].map(value=>({value,label:value}))}
            placeholder="Choose engagement"
          />
          <Area
            name="lessonReference"
            label="Lesson reference / Quran-Arabic context"
          />
          <Area name="whatWentWell" label="What went well" />
          <Area name="needsPractice" label="Needs practice" />
          <Area name="homework" label="Homework or revision" />
          <Area name="nextLesson" label="Next-lesson starting point" />
          <Area name="privateNote" label="Private teacher note" />
          <p className="text-xs leading-5 text-slate-500 sm:col-span-2">
            Absent and excused records do not require progress fields. Private
            notes stay out of every parent draft version.
          </p>
          <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
            <button
              name="intent"
              value="draft"
              className="min-h-12 rounded-xl border border-slate-300 bg-white font-bold"
            >
              Save unfinished
            </button>
            <button name="intent" value="complete" className={button}>
              Complete and generate drafts
            </button>
          </div>
        </form>
      </Card>
    </>
  );
}
function Area({ name, label }: { name: string; label: string }) {
  return (
    <label className="text-sm font-bold">
      {label}
      <textarea name={name} className={`${input} min-h-24 py-3`} />
    </label>
  );
}
