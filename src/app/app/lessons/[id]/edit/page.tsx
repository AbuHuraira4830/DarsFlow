import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, PageHeader, button, input } from "@/components/workspace-ui";
import { db } from "@/server/db";
import { attendance, lessons } from "@/server/schema";
import { requireWorkspace } from "@/server/session";
import { updateLesson } from "../../../actions";
import {FormSelect} from "@/components/server-form-controls";
export default async function EditLesson({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const ctx = await requireWorkspace();
  const { id } = await params;
  const lesson = await db
    .select()
    .from(lessons)
    .where(and(eq(lessons.id, id), eq(lessons.academyId, ctx.academy.id)))
    .then((r) => r[0]);
  const record = lesson
    ? await db
        .select()
        .from(attendance)
        .where(eq(attendance.lessonId, id))
        .then((r) => r[0])
    : null;
  if (!lesson || !record) notFound();
  if (
    ctx.membership.role === "teacher" &&
    lesson.teacherMembershipId !== ctx.membership.id
  )
    notFound();
  return (
    <>
      <PageHeader
        eyebrow={
          lesson.status === "complete"
            ? "Edit completed lesson"
            : "Resume unfinished lesson"
        }
        title="Lesson details"
        description="Material changes preserve history and require fresh draft review."
      />
      <Card>
        <form action={updateLesson} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="lessonId" value={id} />
          <Field
            name="lessonReference"
            label="Lesson reference"
            value={lesson.lessonReference}
          />
          <FormSelect name="attendance" label="Attendance" defaultValue={record.status} options={["Attended","Late","Absent","Excused"].map(value=>({value,label:value}))}/>
          <Field
            name="whatWentWell"
            label="What went well"
            value={record.whatWentWell}
          />
          <Field
            name="needsPractice"
            label="Needs practice"
            value={record.needsPractice}
          />
          <Field name="homework" label="Homework" value={record.homework} />
          <Field
            name="nextLesson"
            label="Next lesson"
            value={record.nextLesson}
          />
          <Field
            name="engagement"
            label="Engagement"
            value={record.engagement}
          />
          <Field
            name="privateNote"
            label="Private note"
            value={lesson.privateNote}
          />
          {lesson.status === "complete" && (
            <Field name="reason" label="Reason for material change" value="" />
          )}
          <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
            <button
              name="intent"
              value="draft"
              className="min-h-12 rounded-xl border font-bold"
            >
              Save unfinished
            </button>
            <button name="intent" value="complete" className={button}>
              {lesson.status === "complete"
                ? "Save and regenerate if needed"
                : "Complete and generate"}
            </button>
          </div>
        </form>
      </Card>
    </>
  );
}
function Field({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value: string | null;
}) {
  return (
    <label className="text-sm font-bold">
      {label}
      <textarea
        name={name}
        defaultValue={value ?? ""}
        className={`${input} min-h-20 py-3`}
      />
    </label>
  );
}
