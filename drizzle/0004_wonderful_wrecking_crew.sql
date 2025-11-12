DROP INDEX "follows_followerId_id_idx";--> statement-breakpoint
DROP INDEX "follows_followingId_id_idx";--> statement-breakpoint
DROP INDEX "follows_follower_following_idx";--> statement-breakpoint
DROP INDEX "session_user_id_idx";--> statement-breakpoint
DROP INDEX "session_expires_idx";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "region" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "followers_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "following_count" integer DEFAULT 0;--> statement-breakpoint
CREATE INDEX "follows_follower_id_index" ON "followers" USING btree ("follower_id","id");--> statement-breakpoint
CREATE INDEX "follows_following_id_index" ON "followers" USING btree ("following_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "follows_follower_following_index" ON "followers" USING btree ("follower_id","following_id");--> statement-breakpoint
CREATE INDEX "sessions_user_id_index" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_at_index" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "slug";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "connections";