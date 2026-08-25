export type LessonStatus = "in_progress" | "complete";
export type CommunicationStatus = "draft" | "ready_for_review" | "reviewed" | "outdated" | "share_opened" | "manually_marked_sent" | "provider_sent" | "provider_failed";
export type SubscriptionState = "trialing" | "active" | "grace_period" | "past_due" | "suspended" | "cancelled";

export function assignWithinTenant(input: { academyId: string; teacherAcademyId: string; resourceAcademyId: string; existingIds: string[]; assignmentId: string }) {
  if (input.academyId !== input.teacherAcademyId || input.academyId !== input.resourceAcademyId) throw new Error("Cross-academy assignment rejected.");
  if (input.existingIds.includes(input.assignmentId)) throw new Error("Assignment already exists.");
  return [...input.existingIds, input.assignmentId];
}
export function teacherCanCreate(input: { active: boolean; archivedAt?: string | null; subscription: SubscriptionState; assigned: boolean }) {
  return input.active && !input.archivedAt && input.assigned && !["suspended", "cancelled"].includes(input.subscription);
}
export function updateReviewedLesson(input: { sourceVersion: number; reviewed: boolean; reason?: string; draftIds: string[] }, now = new Date()) {
  if (input.reviewed && !input.reason?.trim()) throw new Error("A reason is required when editing reviewed lesson facts.");
  return { sourceVersion: input.sourceVersion + 1, materialEditReason: input.reason?.trim() || null, outdatedDraftIds: [...input.draftIds], outdatedAt: now.toISOString() };
}
export function createDraftVersion(input: { generatedContent: string; reviewedContent?: string | null; version: number; sourceVersion: number; creatorId: string }) {
  return { generatedContent: input.generatedContent, reviewedContent: input.reviewedContent ?? null, version: input.version + 1, sourceVersion: input.sourceVersion, createdBy: input.creatorId, status: "ready_for_review" as const };
}
export function reviewedContent(draft: { status: CommunicationStatus; generatedContent: string; reviewedContent?: string | null }) {
  if (!["reviewed", "share_opened", "manually_marked_sent", "provider_sent", "provider_failed"].includes(draft.status)) throw new Error("Review the parent update before sharing.");
  return draft.reviewedContent?.trim() || draft.generatedContent;
}
export function transitionCommunication(current: CommunicationStatus, next: CommunicationStatus, providerConfirmed = false) {
  if ((next === "provider_sent" || next === "provider_failed") && !providerConfirmed) throw new Error("Provider status requires a provider response.");
  const allowed: Record<CommunicationStatus, CommunicationStatus[]> = { draft: ["ready_for_review", "outdated"], ready_for_review: ["reviewed", "outdated"], reviewed: ["outdated", "share_opened", "manually_marked_sent", "provider_sent", "provider_failed"], outdated: [], share_opened: ["manually_marked_sent", "provider_sent", "provider_failed"], manually_marked_sent: [], provider_sent: [], provider_failed: ["provider_sent"] };
  if (!allowed[current].includes(next)) throw new Error("Invalid communication status transition.");
  return next;
}
export function csvCell(value: unknown) {
  let text = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
export function academyCsv(rows: Record<string, unknown>[], requestedAcademyId: string, allowedAcademyId: string) {
  if (requestedAcademyId !== allowedAcademyId) throw new Error("Cross-academy export rejected.");
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  return [keys.map(csvCell).join(","), ...rows.map((row) => keys.map((key) => csvCell(row[key])).join(","))].join("\r\n");
}
export function selectGuardians<T extends { id: string; receiveUpdates: boolean; preferredChannel: string; whatsapp?: string | null; email?: string | null }>(guardians: T[], ids: string[]) {
  const selected = guardians.filter((guardian) => ids.includes(guardian.id) && guardian.receiveUpdates);
  if (!selected.length) throw new Error("Choose at least one eligible guardian.");
  return selected.map((guardian) => ({ ...guardian, valid: guardian.preferredChannel === "whatsapp" ? Boolean(guardian.whatsapp) : Boolean(guardian.email) }));
}
export function assertUniqueSend(existingKey: string | undefined, key: string) { if (existingKey === key) throw new Error("This message was already submitted for sending."); return key; }
export function subscriptionAccess(state: SubscriptionState, role: "owner" | "manager" | "teacher") {
  if (state === "suspended" || state === "cancelled") return { readOnly: true, canCreateLesson: false, canViewBilling: role === "owner", canExport: role === "owner" };
  return { readOnly: false, canCreateLesson: true, canViewBilling: role === "owner", canExport: true };
}
export function paymentDecision(input: { status: string; reason?: string; periodEnd?: string | null }, decision: "approved" | "rejected", now = new Date()) {
  if (input.status !== "pending") throw new Error("Only pending payments can be reviewed.");
  if (decision === "rejected" && !input.reason?.trim()) throw new Error("A rejection reason is required.");
  return { status: decision, reason: input.reason?.trim() || null, periodStart: now.toISOString(), periodEnd: decision === "approved" ? new Date(Math.max(now.getTime(), input.periodEnd ? new Date(input.periodEnd).getTime() : 0) + 30 * 86400000).toISOString() : input.periodEnd ?? null };
}
export function receiptNumber(paymentId: string, approvedAt: string) { return `DF-${approvedAt.slice(0, 10).replaceAll("-", "")}-${paymentId.slice(0, 8).toUpperCase()}`; }
export function escapeEmail(value: string) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }
