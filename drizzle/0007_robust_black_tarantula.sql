CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" "citext" NOT NULL,
	"phone" text NOT NULL,
	"source" text DEFAULT 'experiencias' NOT NULL,
	"message" text,
	"contacted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
