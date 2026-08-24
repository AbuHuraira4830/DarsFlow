import { z } from "zod";

export const academyRoles = ["owner", "manager", "teacher"] as const;
export type AcademyRole = (typeof academyRoles)[number];
export type ResourceAction = "manage_academy" | "manage_people" | "record_lesson" | "view_reports" | "manage_billing";

const permissions: Record<AcademyRole, ResourceAction[]> = {
  owner: ["manage_academy", "manage_people", "record_lesson", "view_reports", "manage_billing"],
  manager: ["manage_academy", "manage_people", "record_lesson", "view_reports"],
  teacher: ["record_lesson", "view_reports"],
};
export function can(role: AcademyRole, action: ResourceAction) { return permissions[role].includes(action); }

export function assertTenant(recordAcademyId: string, activeAcademyId: string) {
  if (recordAcademyId !== activeAcademyId) throw new Error("Record not found in the active academy.");
}

export function assertTeacherAssignment(role: AcademyRole, assignedStudentIds: string[], studentId: string) {
  if (role === "teacher" && !assignedStudentIds.includes(studentId)) throw new Error("Teacher is not assigned to this student.");
}

export const academySchema = z.object({
  name: z.string().trim().min(2).max(100),
  timezone: z.string().trim().min(3).max(80),
  tracks: z.array(z.string().trim().min(2)).min(1),
  supportPhone: z.string().trim().max(30).optional().or(z.literal("")),
});
export const guardianSchema = z.object({
  name: z.string().trim().min(2).max(100), relationship: z.string().trim().min(2).max(50),
  whatsapp: z.string().trim().regex(/^\+?[1-9]\d{7,14}$/, "Use an international phone number.").optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")), preferredChannel: z.enum(["whatsapp", "email"]),
}).refine((value) => value.whatsapp || value.email, { message: "Add at least one guardian contact." });

export function invitationState(invitation: { expiresAt: string; acceptedAt?: string | null; revokedAt?: string | null }, now = new Date()) {
  if (invitation.revokedAt) return "revoked" as const;
  if (invitation.acceptedAt) return "accepted" as const;
  if (new Date(invitation.expiresAt) <= now) return "expired" as const;
  return "pending" as const;
}
export function acceptInvitation(invitation: { academyId: string; expiresAt: string; acceptedAt?: string | null; revokedAt?: string | null }, academyId: string, now = new Date()) {
  assertTenant(invitation.academyId, academyId);
  if (invitationState(invitation, now) !== "pending") throw new Error("Invitation is no longer valid.");
  return { ...invitation, acceptedAt: now.toISOString() };
}

export function whatsappShareUrl(message: string, phone?: string | null) {
  const cleanPhone = phone?.replace(/[^\d]/g, "");
  return `https://wa.me/${cleanPhone ?? ""}?text=${encodeURIComponent(message)}`;
}
export function emailComposeUrl(email: string | null | undefined, studentName: string, message: string) {
  const subject = `Lesson update for ${studentName}`;
  return `mailto:${encodeURIComponent(email ?? "")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}
export function shareStatusTransition(current: "draft" | "reviewed" | "share_opened" | "marked_sent", next: "reviewed" | "share_opened" | "marked_sent") {
  const allowed = { draft: ["reviewed"], reviewed: ["share_opened", "marked_sent"], share_opened: ["share_opened", "marked_sent"], marked_sent: [] } as const;
  if (!(allowed[current] as readonly string[]).includes(next)) throw new Error("Invalid share status transition.");
  return next;
}
export function enforceCapacity(current: number, limit: number) { if (current >= limit) throw new Error("Plan capacity reached."); }
export function trialState(end: string, now = new Date()) { return new Date(end) > now ? "active" : "expired"; }
export function trialDaysRemaining(end: string, now = new Date()) { return Math.max(0, Math.ceil((new Date(end).getTime() - now.getTime()) / 86400000)); }
export function approvePayment(request: { status: string }, reviewerId: string, now = new Date()) {
  if (request.status !== "pending") throw new Error("Only pending payments can be reviewed.");
  return { ...request, status: "approved", reviewedBy: reviewerId, reviewedAt: now.toISOString() };
}
export function generateSaasDrafts(input: { studentName: string; teacherName: string; lessonDate: string; attendance: string; learningTrack: string; lessonReference?: string | null; whatWentWell?: string | null; needsPractice?: string | null; homework?: string | null; nextLesson?: string | null; engagement?: string | null; privateNote?: string | null }) {
  const attended = input.attendance === "Attended" || input.attendance === "Late";
  const firstName = input.studentName.split(/\s+/)[0];
  const facts = attended ? [
    `${firstName} worked on ${input.lessonReference} on ${input.lessonDate}.`,
    input.whatWentWell ? `MashaAllah, ${input.whatWentWell}` : "",
    input.needsPractice ? `A helpful area to practise is ${input.needsPractice}` : "",
    input.homework ? `For revision: ${input.homework}` : "",
  ].filter(Boolean).join(" ") : `${firstName} was ${input.attendance.toLowerCase()} on ${input.lessonDate}. No lesson progress was recorded.`;
  const base = [`Student: ${input.studentName}`, `Teacher: ${input.teacherName}`, `Date: ${input.lessonDate}`, `Attendance: ${input.attendance}`, `Track: ${input.learningTrack}`];
  const progress = attended ? [`Covered: ${input.lessonReference}`, `Strength: ${input.whatWentWell}`, input.needsPractice ? `Needs practice: ${input.needsPractice}` : "", input.homework ? `Homework: ${input.homework}` : "", `Next lesson: ${input.nextLesson}`, `Engagement: ${input.engagement}`].filter(Boolean) : ["Progress: Not recorded for this attendance status"];
  return {
    parent: `Assalamu Alaikum. ${facts}\n\nDraft — please review before sharing.`,
    handover: [...base, ...progress, input.privateNote ? `Private note: ${input.privateNote}` : ""].filter(Boolean).join("\n"),
    management: [...base, ...progress, "Teacher review required: Yes", input.privateNote ? `Internal note: ${input.privateNote}` : ""].filter(Boolean).join("\n"),
  };
}
