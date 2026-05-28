CREATE TABLE "favorites" (
	"user_id" uuid NOT NULL,
	"genetic_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "favorites_user_id_genetic_id_pk" PRIMARY KEY("user_id","genetic_id")
);
--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_genetic_id_genetics_id_fk" FOREIGN KEY ("genetic_id") REFERENCES "public"."genetics"("id") ON DELETE cascade ON UPDATE no action;