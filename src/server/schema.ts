import { boolean, index, integer, jsonb, pgTable as sqliteTable, primaryKey, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
};

export const user = sqliteTable("user", {
  id: text("id").primaryKey(), name: text("name").notNull(), email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false), image: text("image"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull(), updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull(),
});
export const session = sqliteTable("session", {
  id: text("id").primaryKey(), expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(), token: text("token").notNull().unique(),
  ipAddress: text("ipAddress"), userAgent: text("userAgent"), userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull(), updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull(),
});
export const account = sqliteTable("account", {
  id: text("id").primaryKey(), accountId: text("accountId").notNull(), providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }), accessToken: text("accessToken"), refreshToken: text("refreshToken"),
  idToken: text("idToken"), accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { withTimezone: true }), refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { withTimezone: true }), scope: text("scope"), password: text("password"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull(), updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull(),
});
export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(), identifier: text("identifier").notNull(), value: text("value").notNull(), expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull(), updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull(),
});

export const academies = sqliteTable("academies", {
  id: text("id").primaryKey(), name: text("name").notNull(), slug: text("slug").notNull().unique(), timezone: text("timezone").notNull(),
  tracks: jsonb("tracks").$type<string[]>().notNull(), supportPhone: text("support_phone"), status: text("status").notNull().default("trial"), onboardingComplete: boolean("onboarding_complete").notNull().default(false), ...timestamps,
});
export const memberships = sqliteTable("academy_memberships", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }), role: text("role").notNull(), active: boolean("active").notNull().default(true), archivedAt: text("archived_at"), ...timestamps,
}, (t) => [uniqueIndex("membership_academy_user").on(t.academyId, t.userId), index("membership_user_active").on(t.userId, t.active)]);
export const invitations = sqliteTable("invitations", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }),
  email: text("email").notNull(), role: text("role").notNull(), tokenHash: text("token_hash").notNull().unique(), expiresAt: text("expires_at").notNull(), acceptedAt: text("accepted_at"), revokedAt: text("revoked_at"), invitedBy: text("invited_by").notNull(), accessRequestId: text("access_request_id"), ...timestamps,
}, (t) => [index("invitation_academy_email").on(t.academyId, t.email)]);
export const students = sqliteTable("students", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(), learningTrack: text("learning_track").notNull(), currentLevel: text("current_level"), internalNotes: text("internal_notes"), archivedAt: text("archived_at"), ...timestamps,
}, (t) => [index("student_academy_archived").on(t.academyId, t.archivedAt)]);
export const guardians = sqliteTable("guardians", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }),
  name: text("name").notNull(), relationship: text("relationship").notNull(), whatsapp: text("whatsapp"), email: text("email"), preferredChannel: text("preferred_channel").notNull().default("whatsapp"), ...timestamps,
}, (t) => [index("guardian_academy").on(t.academyId)]);
export const studentGuardians = sqliteTable("student_guardians", {
  studentId: text("student_id").notNull().references(() => students.id, { onDelete: "cascade" }), guardianId: text("guardian_id").notNull().references(() => guardians.id, { onDelete: "cascade" }), receiveUpdates: boolean("receive_updates").notNull().default(true),
}, (t) => [primaryKey({ columns: [t.studentId, t.guardianId] })]);
export const classes = sqliteTable("classes", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }), name: text("name").notNull(), learningTrack: text("learning_track").notNull(), format: text("format").notNull(), meetingDays: jsonb("meeting_days").$type<string[]>().notNull(), meetingTime: text("meeting_time").notNull(), archivedAt: text("archived_at"), ...timestamps,
}, (t) => [index("class_academy_archived").on(t.academyId, t.archivedAt)]);
export const classTeachers = sqliteTable("class_teachers", {
  classId: text("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }), membershipId: text("membership_id").notNull().references(() => memberships.id, { onDelete: "cascade" }), assignment: text("assignment").notNull().default("main"),
}, (t) => [primaryKey({ columns: [t.classId, t.membershipId] })]);
export const classEnrollments = sqliteTable("class_enrollments", {
  classId: text("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }), studentId: text("student_id").notNull().references(() => students.id, { onDelete: "cascade" }), active: boolean("active").notNull().default(true),
}, (t) => [primaryKey({ columns: [t.classId, t.studentId] })]);
export const teacherStudents = sqliteTable("teacher_students", {
  membershipId: text("membership_id").notNull().references(() => memberships.id, { onDelete: "cascade" }), studentId: text("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
}, (t) => [primaryKey({ columns: [t.membershipId, t.studentId] })]);
export const lessons = sqliteTable("lessons", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }), classId: text("class_id").references(() => classes.id), teacherMembershipId: text("teacher_membership_id").notNull().references(() => memberships.id), substituteForMembershipId: text("substitute_for_membership_id").references(() => memberships.id), lessonDate: text("lesson_date").notNull(), lessonReference: text("lesson_reference"), learningTrack: text("learning_track").notNull(), privateNote: text("private_note"), sourceVersion: integer("source_version").notNull().default(1), status: text("status").notNull().default("in_progress"), completedAt: text("completed_at"), materialEditReason: text("material_edit_reason"), idempotencyKey: text("idempotency_key").notNull().unique(), enteredLate: boolean("entered_late").notNull().default(false), ...timestamps,
}, (t) => [index("lesson_academy_date").on(t.academyId, t.lessonDate), index("lesson_teacher_date").on(t.teacherMembershipId, t.lessonDate)]);
export const lessonRevisions = sqliteTable("lesson_revisions", { id:text("id").primaryKey(), lessonId:text("lesson_id").notNull().references(()=>lessons.id,{onDelete:"cascade"}), academyId:text("academy_id").notNull().references(()=>academies.id,{onDelete:"cascade"}), sourceVersion:integer("source_version").notNull(), snapshot:jsonb("snapshot").$type<Record<string,unknown>>().notNull(), reason:text("reason"), actorUserId:text("actor_user_id").notNull(), createdAt:text("created_at").notNull() },t=>[index("lesson_revision_lesson_version").on(t.lessonId,t.sourceVersion)]);
export const attendance = sqliteTable("attendance", {
  id: text("id").primaryKey(), lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }), studentId: text("student_id").notNull().references(() => students.id), status: text("status").notNull(), whatWentWell: text("what_went_well"), needsPractice: text("needs_practice"), homework: text("homework"), nextLesson: text("next_lesson"), engagement: text("engagement"), context: jsonb("context").$type<Record<string, string>>(), ...timestamps,
}, (t) => [uniqueIndex("attendance_lesson_student").on(t.lessonId, t.studentId)]);
export const generatedDrafts = sqliteTable("generated_drafts", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }), lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }), studentId: text("student_id").notNull().references(() => students.id), kind: text("kind").notNull(), content: text("content").notNull(), generatedContent: text("generated_content").notNull().default(""), reviewedContent: text("reviewed_content"), version: integer("version").notNull().default(1), sourceVersion: integer("source_version").notNull(), status: text("status").notNull().default("draft"), createdBy: text("created_by"), reviewedBy: text("reviewed_by"), reviewedAt: text("reviewed_at"), outdatedAt: text("outdated_at"), ...timestamps,
}, (t) => [index("draft_academy_status").on(t.academyId, t.status), index("draft_lesson_version").on(t.lessonId, t.version)]);
export const shareActivities = sqliteTable("share_activities", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }), draftId: text("draft_id").notNull().references(() => generatedDrafts.id), guardianId: text("guardian_id").references(() => guardians.id), channel: text("channel").notNull(), status: text("status").notNull(), occurredAt: text("occurred_at").notNull(), actorUserId: text("actor_user_id").notNull(),
});
export const subscriptionPlans = sqliteTable("subscription_plans", {
  id: text("id").primaryKey(), name: text("name").notNull().unique(), description:text("description"), activeStudentLimit: integer("active_student_limit").notNull(), activeTeacherLimit: integer("active_teacher_limit").notNull(), trialDays:integer("trial_days").notNull().default(14), graceDays:integer("grace_days").notNull().default(7), priceMinor: integer("price_minor"), currency: text("currency"), active: boolean("active").notNull().default(true), ...timestamps,
});
export const academySubscriptions = sqliteTable("academy_subscriptions", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().unique().references(() => academies.id, { onDelete: "cascade" }), planId: text("plan_id").notNull().references(() => subscriptionPlans.id), status: text("status").notNull(), trialStartsAt: text("trial_starts_at"), trialEndsAt: text("trial_ends_at"), periodStartsAt: text("period_starts_at"), periodEndsAt: text("period_ends_at"), ...timestamps,
});
export const paymentRequests = sqliteTable("payment_requests", {
  id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }), reference: text("reference").notNull(), amountMinor: integer("amount_minor").notNull(), currency: text("currency").notNull(), paidAt: text("paid_at").notNull(), note: text("note"), status: text("status").notNull().default("pending"), reviewedBy: text("reviewed_by"), reviewedAt: text("reviewed_at"), rejectionReason: text("rejection_reason"), ...timestamps,
}, (t) => [uniqueIndex("payment_academy_reference").on(t.academyId, t.reference), index("payment_status").on(t.status)]);
export const emailDeliveries = sqliteTable("email_deliveries", { id: text("id").primaryKey(), academyId: text("academy_id").references(() => academies.id, { onDelete: "cascade" }), kind: text("kind").notNull(), recipient: text("recipient").notNull(), idempotencyKey: text("idempotency_key").notNull().unique(), providerMessageId: text("provider_message_id"), status: text("status").notNull(), errorCode: text("error_code"), createdAt: text("created_at").notNull(), updatedAt: text("updated_at").notNull() });
export const notifications = sqliteTable("notifications", { id: text("id").primaryKey(), academyId: text("academy_id").notNull().references(() => academies.id, { onDelete: "cascade" }), userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }), dedupeKey:text("dedupe_key").unique(), title: text("title").notNull(), body: text("body").notNull(), readAt: text("read_at"), createdAt: text("created_at").notNull() });
export const developmentOutbox = sqliteTable("development_outbox", { id:text("id").primaryKey(), kind:text("kind").notNull(), recipient:text("recipient").notNull(), subject:text("subject").notNull(), text:text("text").notNull(), actionUrl:text("action_url"), createdAt:text("created_at").notNull() },t=>[index("development_outbox_created").on(t.createdAt)]);
export const platformSettings = sqliteTable("platform_settings", { id: text("id").primaryKey(), paymentInstructions: text("payment_instructions"), publicSupportEmail: text("public_support_email"), publicSupportWhatsapp: text("public_support_whatsapp"), businessDisplayName: text("business_display_name"), supportHours: text("support_hours"), updatedBy: text("updated_by"), ...timestamps });
export const accessRequests = sqliteTable("access_requests", {
  id:text("id").primaryKey(), academyName:text("academy_name").notNull(), contactName:text("contact_name").notNull(), email:text("email").notNull(), whatsapp:text("whatsapp").notNull(), studentCount:integer("student_count").notNull(), teacherCount:integer("teacher_count").notNull(), subjects:jsonb("subjects").$type<string[]>().notNull(), countryTimezone:text("country_timezone"), message:text("message"), status:text("status").notNull().default("new"), internalNotes:text("internal_notes"), contactPreference:text("contact_preference").notNull().default("whatsapp"), duplicateOfId:text("duplicate_of_id"), academyId:text("academy_id").references(()=>academies.id,{onDelete:"set null"}), lastContactedAt:text("last_contacted_at"), ...timestamps,
},t=>[index("access_request_status_created").on(t.status,t.createdAt),index("access_request_email").on(t.email)]);
export const accessRequestActivities = sqliteTable("access_request_activities", { id:text("id").primaryKey(), accessRequestId:text("access_request_id").notNull().references(()=>accessRequests.id,{onDelete:"cascade"}), actorUserId:text("actor_user_id"), action:text("action").notNull(), detail:text("detail"), occurredAt:text("occurred_at").notNull() },t=>[index("access_request_activity_lead").on(t.accessRequestId,t.occurredAt)]);
export const accessRequestRateLimits = sqliteTable("access_request_rate_limits", { id:text("id").primaryKey(), fingerprintHash:text("fingerprint_hash").notNull(), createdAt:text("created_at").notNull() },t=>[index("access_request_rate_fingerprint").on(t.fingerprintHash,t.createdAt)]);
export const auditEvents = sqliteTable("audit_events", { id: text("id").primaryKey(), academyId: text("academy_id").references(() => academies.id, { onDelete: "cascade" }), actorUserId: text("actor_user_id"), action: text("action").notNull(), entityType: text("entity_type").notNull(), entityId: text("entity_id"), metadata: jsonb("metadata").$type<Record<string, unknown>>(), occurredAt: text("occurred_at").notNull() });
