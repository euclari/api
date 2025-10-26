CREATE TABLE "followers" (
	"id" bigint PRIMARY KEY NOT NULL,
	"follower_id" bigint NOT NULL,
	"following_id" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_following_id_users_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "follows_followerId_id_idx" ON "followers" USING btree ("follower_id","id");--> statement-breakpoint
CREATE INDEX "follows_followingId_id_idx" ON "followers" USING btree ("following_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "follows_follower_following_idx" ON "followers" USING btree ("follower_id","following_id");