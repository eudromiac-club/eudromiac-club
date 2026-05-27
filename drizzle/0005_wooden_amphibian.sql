CREATE TYPE "public"."tracking_carrier" AS ENUM('andreani', 'correo_argentino', 'via_cargo', 'propio');--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "tracking_carrier" "tracking_carrier";--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "tracking_number" text;