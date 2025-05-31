-- WebAuthn and User Profile Tables Migration
CREATE TABLE `user_profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`display_name` text,
	`email` text,
	`subscription_level` text DEFAULT 'free',
	`expires_at` text,
	`subscription_updated_at` text,
	`selected_guide_id` text,
	`preferred_language` text DEFAULT 'en',
	`first_name` text,
	`last_name` text,
	`phone_number` text,
	`enable_passkeys` integer DEFAULT 1,
	`last_passkey_login` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `webauthn_credentials` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`credential_public_key` text NOT NULL,
	`counter` integer DEFAULT 0 NOT NULL,
	`credential_device_type` text NOT NULL,
	`credential_backed_up` integer DEFAULT 0 NOT NULL,
	`friendly_name` text,
	`user_agent` text,
	`last_used` text,
	`sign_count` integer DEFAULT 0,
	`transports` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user_profiles`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `webauthn_challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`challenge` text NOT NULL,
	`type` text NOT NULL,
	`user_id` text,
	`ip_address` text,
	`user_agent` text,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_profiles_email_unique` ON `user_profiles` (`email`);
--> statement-breakpoint
CREATE UNIQUE INDEX `webauthn_challenges_challenge_unique` ON `webauthn_challenges` (`challenge`);
--> statement-breakpoint
ALTER TABLE `audit_logs` ADD `user_id` text REFERENCES user_profiles(user_id);
--> statement-breakpoint
UPDATE `audit_logs` SET `entity_type` = 'user_profile' WHERE `entity_type` = 'team_member';
--> statement-breakpoint
UPDATE `audit_logs` SET `access_method` = 'webauthn' WHERE `access_method` = 'mcp';