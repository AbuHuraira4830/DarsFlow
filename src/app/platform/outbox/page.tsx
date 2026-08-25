import { desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, Empty, PageHeader } from "@/components/workspace-ui";
import { db } from "@/server/db";
import { developmentOutbox } from "@/server/schema";
import { isPlatformAdmin, requireUser } from "@/server/session";
export default async function Outbox(){if(process.env.NODE_ENV==="production"&&process.env.ENABLE_TEST_OUTBOX!=="true")notFound();const session=await requireUser();if(!isPlatformAdmin(session.user.email))notFound();const messages=await db.select().from(developmentOutbox).orderBy(desc(developmentOutbox.createdAt));return <main className="mx-auto max-w-4xl p-5"><PageHeader eyebrow="Development only" title="Email outbox" description="These messages were captured locally and were not delivered."/><Card>{messages.length?messages.map(message=><article key={message.id} className="border-b py-4"><strong>{message.subject}</strong><p className="text-sm text-slate-500">{message.kind} · {message.recipient} · {message.createdAt}</p><pre className="mt-2 whitespace-pre-wrap text-sm">{message.text}</pre>{message.actionUrl&&<a className="mt-2 inline-block font-bold text-teal-700" href={message.actionUrl}>Open protected action link</a>}</article>):<Empty>No development messages.</Empty>}</Card></main>}
