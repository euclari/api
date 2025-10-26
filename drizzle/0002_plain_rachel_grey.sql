ALTER TABLE "sessions" ADD COLUMN "ip" varchar(45);--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "slug" varchar(26);--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "agent" varchar(264);--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "device" varchar(64);