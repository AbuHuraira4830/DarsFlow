import { z } from "zod";

export const leadStatuses=["new","contacted","demo_scheduled","invitation_sent","onboarded","not_a_fit","archived"] as const;
export type LeadStatus=(typeof leadStatuses)[number];
export const leadStatusLabels:Record<LeadStatus,string>={new:"New",contacted:"Contacted",demo_scheduled:"Demo scheduled",invitation_sent:"Invitation sent",onboarded:"Onboarded",not_a_fit:"Not a fit",archived:"Archived"};
export const subjectOptions=["Qaida","Quran Reading","Hifz","Tajweed","Arabic","Islamic Studies","Other"] as const;
const phone=/^\+[1-9]\d{7,14}$/;
export const accessRequestSchema=z.object({academyName:z.string().trim().min(2).max(120),contactName:z.string().trim().min(2).max(100),email:z.string().trim().toLowerCase().email().max(254),whatsapp:z.string().trim().regex(phone,"Use international format, for example +923001234567."),studentCount:z.coerce.number().int().min(1).max(100000),teacherCount:z.coerce.number().int().min(1).max(10000),subjects:z.array(z.enum(subjectOptions)).min(1,"Select at least one teaching subject."),countryTimezone:z.string().trim().max(100).optional(),message:z.string().trim().max(1000).optional(),acknowledged:z.literal("yes"),website:z.string().max(0)});
export type AccessRequestInput=z.infer<typeof accessRequestSchema>;
export function normalizePhone(value:string){return value.replace(/[\s()-]/g,"");}
export function canTransitionLead(from:LeadStatus,to:LeadStatus){if(from===to)return true;const allowed:Record<LeadStatus,LeadStatus[]>={new:["contacted","demo_scheduled","invitation_sent","not_a_fit","archived"],contacted:["demo_scheduled","invitation_sent","not_a_fit","archived"],demo_scheduled:["contacted","invitation_sent","not_a_fit","archived"],invitation_sent:["contacted","onboarded","archived"],onboarded:["archived"],not_a_fit:["contacted","archived"],archived:["new"]};return allowed[from].includes(to)}
export function publicPlan<T extends {active:boolean;name:string}>(plan:T){return plan.active&&plan.name.toLowerCase()!=="trial"}
export function formatPlanPrice(priceMinor:number|null,currency:string|null){if(priceMinor==null||!currency)return "Contact us for pricing";return new Intl.NumberFormat("en",{style:"currency",currency,maximumFractionDigits:priceMinor%100?2:0}).format(priceMinor/100)+" / month"}
export function whatsappUrl(phone:string,message:string){return `https://wa.me/${normalizePhone(phone).replace(/^\+/,"")}?text=${encodeURIComponent(message)}`}
