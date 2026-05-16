ALTER TYPE "public"."user_status" ADD VALUE 'under_review' BEFORE 'active';--> statement-breakpoint
ALTER TYPE "public"."user_status" ADD VALUE 'rejected' BEFORE 'suspended';