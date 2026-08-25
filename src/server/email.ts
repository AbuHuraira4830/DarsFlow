import { Resend } from "resend";
import { env } from "./env";
import { escapeEmail } from "@/lib/pilot";
import { db } from "./db";
import { developmentOutbox } from "./schema";

export type EmailKind = "verify"|"reset"|"invitation"|"invitation_accepted"|"welcome"|"payment_submitted"|"payment_approved"|"payment_rejected"|"parent_update";
export type EmailResult = { mode:"provider"|"development_outbox"; status:"accepted"|"failed"|"not_sent"; providerMessageId?:string; errorCode?:string };
export async function sendTransactionalEmail(input:{kind:EmailKind;to:string;subject:string;text:string;actionUrl?:string;idempotencyKey:string}):Promise<EmailResult>{
  if(!env.RESEND_API_KEY||!env.EMAIL_FROM) { if(process.env.NODE_ENV!=="production"||process.env.ENABLE_TEST_OUTBOX==="true") await db.insert(developmentOutbox).values({id:crypto.randomUUID(),kind:input.kind,recipient:input.to,subject:input.subject,text:input.text,actionUrl:input.actionUrl??null,createdAt:new Date().toISOString()}); return {mode:"development_outbox",status:"not_sent"}; }
  const resend=new Resend(env.RESEND_API_KEY);const link=input.actionUrl?`<p><a href="${escapeEmail(input.actionUrl)}" style="color:#0f766e;font-weight:700">Continue in DarsFlow</a></p>`:"";
  const {data,error}=await resend.emails.send({from:`DarsFlow <${env.EMAIL_FROM}>`,to:[input.to],subject:input.subject,text:input.text,html:`<div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6"><h1 style="font-size:22px">DarsFlow</h1><p>${escapeEmail(input.text).replaceAll("\n","<br>")}</p>${link}<p style="color:#64748b;font-size:12px">This is a private academy notification.</p></div>`},{idempotencyKey:input.idempotencyKey});
  if(error)return {mode:"provider",status:"failed",errorCode:error.name??"resend_error"};return {mode:"provider",status:"accepted",providerMessageId:data?.id};
}
