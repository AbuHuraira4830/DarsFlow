CREATE TABLE `email_deliveries` (
	`id` text PRIMARY KEY NOT NULL,
	`academy_id` text,
	`kind` text NOT NULL,
	`recipient` text NOT NULL,
	`idempotency_key` text NOT NULL,
	`provider_message_id` text,
	`status` text NOT NULL,
	`error_code` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`academy_id`) REFERENCES `academies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_deliveries_idempotency_key_unique` ON `email_deliveries` (`idempotency_key`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`academy_id` text NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`read_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`academy_id`) REFERENCES `academies`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `generated_drafts` ADD `generated_content` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `generated_drafts` ADD `reviewed_content` text;--> statement-breakpoint
ALTER TABLE `generated_drafts` ADD `version` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `generated_drafts` ADD `created_by` text;--> statement-breakpoint
ALTER TABLE `generated_drafts` ADD `outdated_at` text;--> statement-breakpoint
ALTER TABLE `lessons` ADD `substitute_for_membership_id` text REFERENCES academy_memberships(id);--> statement-breakpoint
ALTER TABLE `lessons` ADD `status` text DEFAULT 'in_progress' NOT NULL;--> statement-breakpoint
ALTER TABLE `lessons` ADD `completed_at` text;--> statement-breakpoint
ALTER TABLE `lessons` ADD `material_edit_reason` text;--> statement-breakpoint
ALTER TABLE `academy_memberships` ADD `archived_at` text;--> statement-breakpoint
ALTER TABLE `payment_requests` ADD `amount_minor` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_requests` ADD `currency` text NOT NULL;--> statement-breakpoint
ALTER TABLE `payment_requests` ADD `paid_at` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `payment_academy_reference` ON `payment_requests` (`academy_id`,`reference`);