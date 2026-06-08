ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_genetic_id_genetics_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_genetic_id_genetics_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "genetic_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_genetic_id_genetics_id_fk" FOREIGN KEY ("genetic_id") REFERENCES "public"."genetics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_genetic_id_genetics_id_fk" FOREIGN KEY ("genetic_id") REFERENCES "public"."genetics"("id") ON DELETE set null ON UPDATE no action;