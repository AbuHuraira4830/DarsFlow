ALTER TABLE "invitations" ADD COLUMN "access_request_id" text;--> statement-breakpoint
ALTER TABLE "platform_settings" ADD COLUMN "public_support_email" text;--> statement-breakpoint
ALTER TABLE "platform_settings" ADD COLUMN "public_support_whatsapp" text;--> statement-breakpoint
ALTER TABLE "platform_settings" ADD COLUMN "business_display_name" text;--> statement-breakpoint
ALTER TABLE "platform_settings" ADD COLUMN "support_hours" text;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "access_requests" (
  "id" text PRIMARY KEY NOT NULL, "academy_name" text NOT NULL, "contact_name" text NOT NULL,
  "email" text NOT NULL, "whatsapp" text NOT NULL, "student_count" integer NOT NULL,
  "teacher_count" integer NOT NULL, "subjects" jsonb NOT NULL, "country_timezone" text,
  "message" text, "status" text DEFAULT 'new' NOT NULL, "internal_notes" text,
  "contact_preference" text DEFAULT 'whatsapp' NOT NULL, "duplicate_of_id" text,
  "academy_id" text REFERENCES "academies"("id") ON DELETE set null, "last_contacted_at" text,
  "created_at" text NOT NULL, "updated_at" text NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "access_request_status_created" ON "access_requests" ("status","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "access_request_email" ON "access_requests" ("email");--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "access_request_activities" (
  "id" text PRIMARY KEY NOT NULL, "access_request_id" text NOT NULL REFERENCES "access_requests"("id") ON DELETE cascade,
  "actor_user_id" text, "action" text NOT NULL, "detail" text, "occurred_at" text NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "access_request_activity_lead" ON "access_request_activities" ("access_request_id","occurred_at");--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "access_request_rate_limits" ("id" text PRIMARY KEY NOT NULL, "fingerprint_hash" text NOT NULL, "created_at" text NOT NULL);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "access_request_rate_fingerprint" ON "access_request_rate_limits" ("fingerprint_hash","created_at");
