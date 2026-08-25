import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { createClass, setClassEnrollment } from "../actions";
import {
  Card,
  Empty,
  PageHeader,
  button,
  input,
} from "@/components/workspace-ui";
import { db } from "@/server/db";
import { classes, classEnrollments, students } from "@/server/schema";
import { requireWorkspace } from "@/server/session";
import {FormSelect} from "@/components/server-form-controls";

export default async function ClassesPage() {
  const ctx = await requireWorkspace();
  const list = await db
    .select()
    .from(classes)
    .where(eq(classes.academyId, ctx.academy.id));
  const studentList = await db
    .select()
    .from(students)
    .where(eq(students.academyId, ctx.academy.id));
  const enrollments = await db
    .select()
    .from(classEnrollments)
    .innerJoin(
      students,
      and(
        eq(students.id, classEnrollments.studentId),
        eq(students.academyId, ctx.academy.id),
      ),
    );
  const canManage = ["owner", "manager"].includes(ctx.membership.role);
  return (
    <>
      <PageHeader
        eyebrow="Teaching schedule"
        title="Classes and enrollments"
        description={`Meeting times use ${ctx.academy.timezone}. One-to-one and small groups are supported.`}
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Scheduled classes">
          {list.length ? (
            <div className="mt-3 space-y-3">
              {list.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <p className="font-bold">{c.name}</p>
                  <p className="text-sm text-slate-500">
                  {c.learningTrack} · {c.format.replaceAll("_", " ")} ·{" "}
                    {c.meetingDays.join(", ")} {c.meetingTime}
                  </p>
                  <Link
                    href={`/app/classes/${c.id}/record`}
                    className="mt-3 inline-block min-h-10 font-bold text-teal-700"
                  >
                    Record group lesson
                  </Link>
                  <div className="mt-2 text-xs">
                    {enrollments
                      .filter(
                        (e) =>
                          e.class_enrollments.classId === c.id &&
                          e.class_enrollments.active,
                      )
                      .map((e) => (
                        <span
                          key={e.students.id}
                          className="mr-2 rounded bg-teal-50 px-2 py-1"
                        >
                          {e.students.displayName}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty>No classes yet.</Empty>
          )}
        </Card>
        {canManage && (
          <Card title="Create class" tone="sand">
            <form action={createClass} className="mt-4 space-y-4">
              <Field name="name" label="Class name" />
              <Field name="track" label="Learning track" />
              <FormSelect name="format" label="Format" defaultValue="one_to_one" options={[{value:"one_to_one",label:"One-to-one"},{value:"small_group",label:"Small group"}]}/>
              <fieldset>
                <legend className="text-sm font-bold">Meeting days</legend>
                <div className="mt-2 flex flex-wrap gap-3">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((d) => (
                    <label key={d} className="text-sm">
                      <input type="checkbox" name="days" value={d} /> {d}
                    </label>
                  ))}
                </div>
              </fieldset>
              <Field name="time" label="Typical time" type="time" />
              <button className={button}>Create class</button>
            </form>
          </Card>
        )}
      </div>
      {canManage && (
        <Card title="Manage enrollment" tone="mint">
          <form
            action={setClassEnrollment}
            className="mt-3 grid gap-3 sm:grid-cols-3"
          >
            <FormSelect name="classId" label="Class" defaultValue={list[0]?.id} options={list.map(c=>({value:c.id,label:c.name}))}/>
            <FormSelect name="studentId" label="Student" defaultValue={studentList[0]?.id} options={studentList.map(s=>({value:s.id,label:s.displayName}))}/>
            <FormSelect name="active" label="Status" defaultValue="true" options={[{value:"true",label:"Enrolled"},{value:"false",label:"Removed"}]}/>
            <button className={`${button} sm:col-span-3`}>
              Update enrollment
            </button>
          </form>
        </Card>
      )}
    </>
  );
}
function Field({
  name,
  label,
  type = "text",
}: {
  name: string;
  label: string;
  type?: string;
}) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input required name={name} type={type} className={input} />
    </label>
  );
}
