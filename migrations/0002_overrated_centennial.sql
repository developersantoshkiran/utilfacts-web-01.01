ALTER TABLE "entity_consumption" RENAME COLUMN "service_id" TO "entity_service_id";--> statement-breakpoint
ALTER TABLE "entity_consumption" DROP CONSTRAINT "entity_consumption_service_id_entity_services_id_fk";
--> statement-breakpoint
ALTER TABLE "entity_consumption" ADD CONSTRAINT "entity_consumption_entity_service_id_entity_services_id_fk" FOREIGN KEY ("entity_service_id") REFERENCES "public"."entity_services"("id") ON DELETE no action ON UPDATE no action;