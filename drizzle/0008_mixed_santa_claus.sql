CREATE TABLE "coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" "citext" NOT NULL,
	"discount_pct" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"description" text,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "coupons_code_unique" UNIQUE("code"),
	CONSTRAINT "coupons_discount_pct_range" CHECK ("coupons"."discount_pct" between 1 and 100)
);
