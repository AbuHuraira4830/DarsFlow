import { describe, expect, it } from "vitest";
import { acceptInvitation, approvePayment, assertTeacherAssignment, assertTenant, can, emailComposeUrl, enforceCapacity, guardianSchema, invitationState, shareStatusTransition, trialState, whatsappShareUrl } from "./saas";

describe("SaaS tenancy and permissions", () => {
  it("rejects cross-academy records", () => expect(() => assertTenant("a", "b")).toThrow(/active academy/));
  it("limits teacher access to assignments", () => expect(() => assertTeacherAssignment("teacher", ["s1"], "s2")).toThrow(/not assigned/));
  it("allows managers to manage people but not billing", () => { expect(can("manager", "manage_people")).toBe(true); expect(can("manager", "manage_billing")).toBe(false); });
});
describe("invitations", () => {
  const future = "2099-01-01T00:00:00.000Z";
  it("accepts one valid academy invitation", () => expect(acceptInvitation({ academyId: "a", expiresAt: future }, "a").acceptedAt).toBeTruthy());
  it("rejects expired and accepted invitations", () => { expect(invitationState({ expiresAt: "2020-01-01" })).toBe("expired"); expect(() => acceptInvitation({ academyId: "a", expiresAt: future, acceptedAt: "2026-01-01" }, "a")).toThrow(); });
});
describe("guardian and sharing", () => {
  it("validates contacts", () => expect(guardianSchema.safeParse({ name: "Parent", relationship: "Mother", whatsapp: "bad", email: "", preferredChannel: "whatsapp" }).success).toBe(false));
  it("encodes WhatsApp and email links", () => { expect(whatsappShareUrl("Assalamu Alaikum & welcome", "+92 300 1234567")).toContain("923001234567"); expect(emailComposeUrl("parent@example.test", "Maryam", "Good work")).toContain("Lesson%20update%20for%20Maryam"); });
  it("requires review before sharing", () => { expect(() => shareStatusTransition("draft", "share_opened")).toThrow(); expect(shareStatusTransition("reviewed", "share_opened")).toBe("share_opened"); });
});
describe("classes, subscriptions and payments", () => {
  it("keeps group reports individual through unique student IDs", () => expect(new Set(["student-a", "student-b"]).size).toBe(2));
  it("enforces limits and trial expiry", () => { expect(() => enforceCapacity(20, 20)).toThrow(/capacity/); expect(trialState("2020-01-01")).toBe("expired"); });
  it("approves a pending manual payment once", () => { const approved = approvePayment({ status: "pending" }, "admin"); expect(approved.status).toBe("approved"); expect(() => approvePayment(approved, "admin")).toThrow(); });
});
