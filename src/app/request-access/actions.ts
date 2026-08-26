"use server";
import {createHash} from "node:crypto";
import {and,desc,eq,gt} from "drizzle-orm";
import {headers} from "next/headers";
import {accessRequestSchema,normalizePhone} from "@/lib/acquisition";
import {db} from "@/server/db";
import {accessRequestActivities,accessRequestRateLimits,accessRequests} from "@/server/schema";

export type RequestState={ok:boolean;message:string;fields?:Record<string,string>};
export async function submitAccessRequest(_state:RequestState,form:FormData):Promise<RequestState>{
  const parsed=accessRequestSchema.safeParse({academyName:form.get("academyName"),contactName:form.get("contactName"),email:form.get("email"),whatsapp:normalizePhone(String(form.get("whatsapp")??"")),studentCount:form.get("studentCount"),teacherCount:form.get("teacherCount"),subjects:form.getAll("subjects"),countryTimezone:form.get("countryTimezone")||undefined,message:form.get("message")||undefined,acknowledged:form.get("acknowledged"),website:form.get("website")??""});
  if(!parsed.success){const fields=Object.fromEntries(parsed.error.issues.map(i=>[String(i.path[0]),i.message]));return {ok:false,message:"Please check the highlighted information.",fields}}
  const h=await headers();const fingerprint=createHash("sha256").update(`${h.get("x-forwarded-for")?.split(",")[0]??"unknown"}:${h.get("user-agent")??"unknown"}`).digest("hex");const since=new Date(Date.now()-60*60*1000).toISOString();
  const recent=await db.select().from(accessRequestRateLimits).where(and(eq(accessRequestRateLimits.fingerprintHash,fingerprint),gt(accessRequestRateLimits.createdAt,since)));
  if(recent.length>=3)return {ok:false,message:"Too many requests were submitted from this device. Please try again later."};
  const duplicate=await db.select().from(accessRequests).where(eq(accessRequests.email,parsed.data.email)).orderBy(desc(accessRequests.createdAt)).then(r=>r[0]);
  if(duplicate&&!['archived','not_a_fit'].includes(duplicate.status))return {ok:true,message:"We already have an active request for this email address. We’ll contact you using the details previously provided."};
  const stamp=new Date().toISOString(),id=crypto.randomUUID();
  await db.transaction(async tx=>{await tx.insert(accessRequestRateLimits).values({id:crypto.randomUUID(),fingerprintHash:fingerprint,createdAt:stamp});await tx.insert(accessRequests).values({id,academyName:parsed.data.academyName,contactName:parsed.data.contactName,email:parsed.data.email,whatsapp:parsed.data.whatsapp,studentCount:parsed.data.studentCount,teacherCount:parsed.data.teacherCount,subjects:parsed.data.subjects,countryTimezone:parsed.data.countryTimezone||null,message:parsed.data.message||null,status:"new",contactPreference:"whatsapp",createdAt:stamp,updatedAt:stamp});await tx.insert(accessRequestActivities).values({id:crypto.randomUUID(),accessRequestId:id,action:"request.submitted",detail:"Submitted through the public access form.",occurredAt:stamp})});
  return {ok:true,message:"Your request has been received. We’ll contact you using the details you provided."};
}
