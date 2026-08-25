CREATE TABLE "development_outbox" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"recipient" text NOT NULL,
	"subject" text NOT NULL,
	"text" text NOT NULL,
	"action_url" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_revisions" (
	"id" text PRIMARY KEY NOT NULL,
	"lesson_id" text NOT NULL,
	"academy_id" text NOT NULL,
	"source_version" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"reason" text,
	"actor_user_id" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscription_plans" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "subscription_plans" ADD COLUMN "trial_days" integer DEFAULT 14 NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription_plans" ADD COLUMN "grace_days" integer DEFAULT 7 NOT NULL;--> statement-breakpoint
ALTER TABLE "lesson_revisions" ADD CONSTRAINT "lesson_revisions_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_revisions" ADD CONSTRAINT "lesson_revisions_academy_id_academies_id_fk" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "development_outbox_created" ON "development_outbox" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "lesson_revision_lesson_version" ON "lesson_revisions" USING btree ("lesson_id","source_version");