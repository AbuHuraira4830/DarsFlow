CREATE INDEX "class_academy_archived" ON "classes" USING btree ("academy_id","archived_at");--> statement-breakpoint
CREATE INDEX "draft_academy_status" ON "generated_drafts" USING btree ("academy_id","status");--> statement-breakpoint
CREATE INDEX "draft_lesson_version" ON "generated_drafts" USING btree ("lesson_id","version");--> statement-breakpoint
CREATE INDEX "guardian_academy" ON "guardians" USING btree ("academy_id");--> statement-breakpoint
CREATE INDEX "invitation_academy_email" ON "invitations" USING btree ("academy_id","email");--> statement-breakpoint
CREATE INDEX "lesson_academy_date" ON "lessons" USING btree ("academy_id","lesson_date");--> statement-breakpoint
CREATE INDEX "lesson_teacher_date" ON "lessons" USING btree ("teacher_membership_id","lesson_date");--> statement-breakpoint
CREATE INDEX "membership_user_active" ON "academy_memberships" USING btree ("user_id","active");--> statement-breakpoint
CREATE INDEX "payment_status" ON "payment_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "student_academy_archived" ON "students" USING btree ("academy_id","archived_at");