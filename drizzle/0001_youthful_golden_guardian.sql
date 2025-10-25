ALTER TABLE "users" ADD COLUMN "avatar" char(16);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "banner" char(16);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" varchar(256);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "pronouns" varchar(15);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "font" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "private" boolean;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "locale" varchar(2);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "birthday" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "connections" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
CREATE INDEX "users_birthday_index" ON "users" USING btree ("birthday");