CREATE TYPE "public"."paymentTypes" AS ENUM('Prepaid', 'Postpaid');--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "paymentType" "paymentTypes" DEFAULT 'Postpaid';