import { integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
};

export const user = sqliteTable("user", {
  id: text("id").primaryKey(), name: text("name").notNull(), email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull().default(false), image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(), updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});
export const session = sqliteTable("session", {
  id: text("id").primaryKey(), expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(), token: text("token").notNull().unique(),
  ipAddress: text("ipAddress"), userAgent: text("userAgent"), userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(), updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});
export const account = sqliteTable("account", {
  id: text("id").primaryKey(), accountId: text("accountId").notNull(), providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }), accessToken: text("accessToken"), refreshToken: text("refreshToken"),
  idToken: text("idToken"), accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }), refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }), scope: text("scope"), password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(), updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});
export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(), identifier: text("identifier").notNull(), value: text("value").notNull(), expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(), updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const academies = sqliteTable("academies", {
  id: text("id").primaryKey(), name: text("name").notNull(), slug: text("slug").notNull().unique(), timezone: text("timezone").notNull(),
  tracks: text("tracks", { mode: "json" }).$type<string[]>().notNull(), supportPhone: text("support_phone"), status: text("status").notNull().default("trial"), onboardingComplete: integer("onboarding_complete", { mode: "boolean" }).notNull().default(false), ...timestamps,
});
export const memberships = sqliteTable("academy_memberships", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }), role: text("role").notNull(), active: integer("active", { mode: "boolean" }).notNull().default(true), ...timestamps,
}, (t) => [uniqueIndex("membership_academy_user").on(t.academyId, t.userId)]);
export const invitations = sqliteTable("invitations", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }),
  email: text("email").notNull(), role: text("role").notNull(), tokenHash: text("token_hash").notNull().unique(), expiresAt: text("expires_at").notNull(), acceptedAt: text("accepted_at"), revokedAt: text("revoked_at"), invitedBy: text("invited_by").notNull(), ...timestamps,
});
export const students = sqliteTable("students", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(), learningTrack: text("learning_track").notNull(), currentLevel: text("current_level"), internalNotes: text("internal_notes"), archivedAt: text("archived_at"), ...timestamps,
});
export const guardians = sqliteTable("guardians", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }),
  name: text("name").notNull(), relationship: text("relationship").notNull(), whatsapp: text("whatsapp"), email: text("email"), preferredChannel: text("preferred_channel").notNull().default("whatsapp"), ...timestamps,
});
export const studentGuardians = sqliteTable("student_guardians", {
  studentId: text("student_id").notNull().references(() => students.id, { onDelete: "cascade" }), guardianId: text("guardian_id").notNull().references(() => guardians.id, { onDelete: "cascade" }), receiveUpdates: integer("receive_updates", { mode: "boolean" }).notNull().default(true),
}, (t) => [primaryKey({ columns: [t.studentId, t.guardianId] })]);
export const classes = sqliteTable("classes", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }), name: text("name").notNull(), learningTrack: text("learning_track").notNull(), format: text("format").notNull(), meetingDays: text("meeting_days", { mode: "json" }).$type<string[]>().notNull(), meetingTime: text("meeting_time").notNull(), archivedAt: text("archived_at"), ...timestamps,
});
export const classTeachers = sqliteTable("class_teachers", {
  classId: text("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }), membershipId: text("membership_id").notNull().references(() => memberships.id, { onDelete: "cascade" }), assignment: text("assignment").notNull().default("main"),
}, (t) => [primaryKey({ columns: [t.classId, t.membershipId] })]);
export const classEnrollments = sqliteTable("class_enrollments", {
  classId: text("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }), studentId: text("student_id").notNull().references(() => students.id, { onDelete: "cascade" }), active: integer("active", { mode: "boolean" }).notNull().default(true),
}, (t) => [primaryKey({ columns: [t.classId, t.studentId] })]);
export const teacherStudents = sqliteTable("teacher_students", {
  membershipId: text("membership_id").notNull().references(() => memberships.id, { onDelete: "cascade" }), studentId: text("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
}, (t) => [primaryKey({ columns: [t.membershipId, t.studentId] })]);
export const lessons = sqliteTable("lessons", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }), classId: text("class_id").references(() => classes.id), teacherMembershipId: text("teacher_membership_id").notNull().references(() => memberships.id), lessonDate: text("lesson_date").notNull(), lessonReference: text("lesson_reference"), learningTrack: text("learning_track").notNull(), privateNote: text("private_note"), sourceVersion: integer("source_version").notNull().default(1), idempotencyKey: text("idempotency_key").notNull().unique(), enteredLate: integer("entered_late", { mode: "boolean" }).notNull().default(false), ...timestamps,
});
export const attendance = sqliteTable("attendance", {
  id: text("id").primaryKey(), lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }), studentId: text("student_id").notNull().references(() => students.id), status: text("status").notNull(), whatWentWell: text("what_went_well"), needsPractice: text("needs_practice"), homework: text("homework"), nextLesson: text("next_lesson"), engagement: text("engagement"), context: text("context", { mode: "json" }).$type<Record<string, string>>(), ...timestamps,
}, (t) => [uniqueIndex("attendance_lesson_student").on(t.lessonId, t.studentId)]);
export const generatedDrafts = sqliteTable("generated_drafts", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }), lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }), studentId: text("student_id").notNull().references(() => students.id), kind: text("kind").notNull(), content: text("content").notNull(), sourceVersion: integer("source_version").notNull(), status: text("status").notNull().default("draft"), reviewedBy: text("reviewed_by"), reviewedAt: text("reviewed_at"), ...timestamps,
});
export const shareActivities = sqliteTable("share_activities", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }), draftId: text("draft_id").notNull().references(() => generatedDrafts.id), guardianId: text("guardian_id").references(() => guardians.id), channel: text("channel").notNull(), status: text("status").notNull(), occurredAt: text("occurred_at").notNull(), actorUserId: text("actor_user_id").notNull(),
});
export const subscriptionPlans = sqliteTable("subscription_plans", {
  id: text("id").primaryKey(), name: text("name").notNull().unique(), activeStudentLimit: integer("active_student_limit").notNull(), activeTeacherLimit: integer("active_teacher_limit").notNull(), priceMinor: integer("price_minor"), currency: text("currency"), active: integer("active", { mode: "boolean" }).notNull().default(true), ...timestamps,
});
export const academySubscriptions = sqliteTable("academy_subscriptions", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().unique().references(() => academies.id, { onDelete: "cascade" }), planId: text("plan_id").notNull().references(() => subscriptionPlans.id), status: text("status").notNull(), trialStartsAt: text("trial_starts_at"), trialEndsAt: text("trial_ends_at"), periodStartsAt: text("period_starts_at"), periodEndsAt: text("period_ends_at"), ...timestamps,
});
export const paymentRequests = sqliteTable("payment_requests", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }), reference: text("reference").notNull(), note: text("note"), status: text("status").notNull().default("pending"), reviewedBy: text("reviewed_by"), reviewedAt: text("reviewed_at"), rejectionReason: text("rejection_reason"), ...timestamps,
});
export const platformSettings = sqliteTable("platform_settings", { id: text("id").primaryKey(), paymentInstructions: text("payment_instructions"), updatedBy: text("updated_by"), ...timestamps });
export const auditEvents = sqliteTable("audit_events", { id: text("id").primaryKey(), academyId: text("academy_id").references(() => academies.id, { onDelete: "cascade" }), actorUserId: text("actor_user_id"), action: text("action").notNull(), entityType: text("entity_type").notNull(), entityId: text("entity_id"), metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown>>(), occurredAt: text("occurred_at").notNull() });
