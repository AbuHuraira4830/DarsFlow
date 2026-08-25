import Link from "next/link";
import { and, count, eq, gte, isNull } from "drizzle-orm";
import { Card, PageHeader, button } from "@/components/workspace-ui";
import { db } from "@/server/db";
import { classes, generatedDrafts, lessons, students } from "@/server/schema";
import { requireWorkspace } from "@/server/session";

export default async function Dashboard() {
  const ctx = await requireWorkspace();
  const today = new Date().toISOString().slice(0, 10);
  const studentCount = (await db.select({ n: count() }).from(students).where(and(eq(students.academyId, ctx.academy.id), isNull(students.archivedAt))).then((rows) => rows[0]))?.n ?? 0;
  const classCount = (await db.select({ n: count() }).from(classes).where(eq(classes.academyId, ctx.academy.id)).then((rows) => rows[0]))?.n ?? 0;
  const lessonCount = (await db.select({ n: count() }).from(lessons).where(and(eq(lessons.academyId, ctx.academy.id), gte(lessons.lessonDate, today))).then((rows) => rows[0]))?.n ?? 0;
  const draftCount = (await db.select({ n: count() }).from(generatedDrafts).where(and(eq(generatedDrafts.academyId, ctx.academy.id), eq(generatedDrafts.status, "draft"))).then((rows) => rows[0]))?.n ?? 0;
  return <><PageHeader eyebrow="Academy dashboard" title={`Assalamu Alaikum, ${ctx.user.name.split(" ")[0]}`} description="Today’s teaching activity and the records that still need attention." action={<Link href="/app/lessons/new" className={button}>Record lesson</Link>} /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Metric label="Active students" value={studentCount} /><Metric label="Classes" value={classCount} /><Metric label="Lessons today" value={lessonCount} /><Metric label="Drafts awaiting review" value={draftCount} /></div><div className="mt-6 grid gap-5 lg:grid-cols-2"><Card title="Today’s priorities" tone="mint"><ul className="mt-4 space-y-3 text-sm text-slate-700"><li>Record individual progress for every attended student.</li><li>Review parent updates before opening a share app.</li><li>Follow up on absent and late attendance records.</li></ul></Card><Card title="Honest operational status"><p className="mt-4 text-sm leading-6 text-slate-600">DarsFlow stores academy records in this local environment. WhatsApp and email actions open a compose window; delivery is never assumed.</p></Card></div></>;
}
function Metric({ label, value }: { label: string; value: number }) { return <Card><p className="text-3xl font-semibold text-slate-950">{value}</p><p className="mt-1 text-sm text-slate-500">{label}</p></Card>; }
