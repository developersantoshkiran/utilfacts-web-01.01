CREATE TABLE IF NOT EXISTS "entities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity" text NOT NULL,
	"group_id" uuid NOT NULL,
	"updated_at" timestamp (3) with time zone,
	"created_At" timestamp (3) with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_approval_statuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_bills" (
	"past_reading" numeric DEFAULT '0' NOT NULL,
	"present_reading" numeric DEFAULT '0' NOT NULL,
	"service_id" uuid NOT NULL,
	"units_consumed" numeric NOT NULL,
	"from_date" timestamp (3) with time zone NOT NULL,
	"to_date" timestamp (3) with time zone NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bill_mode" text,
	"due_date" timestamp (3) with time zone NOT NULL,
	"paid_on" timestamp (3) with time zone NOT NULL,
	"payment_status_id" integer NOT NULL,
	"paid_by_id" uuid,
	"payment_mode_id" integer NOT NULL,
	"payment_id" text,
	"updated_at" timestamp (3) with time zone,
	"created_At" timestamp (3) with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_consumption" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"units_consumed" numeric NOT NULL,
	"date" timestamp (3) with time zone NOT NULL,
	"updated_at" timestamp (3) with time zone,
	"created_At" timestamp (3) with time zone NOT NULL,
	CONSTRAINT "entity_consumption_id_created_At_pk" PRIMARY KEY("id","created_At")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" integer NOT NULL,
	"entity_id" uuid,
	"parameter_name" text NOT NULL,
	"sid" text NOT NULL,
	"device_id" integer NOT NULL,
	"updated_at" timestamp (3) with time zone,
	"created_At" timestamp (3) with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"project_id" uuid NOT NULL,
	"updated_at" timestamp (3) with time zone,
	"created_At" timestamp (3) with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "otp" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"otp" integer NOT NULL,
	"sent_email_reference_id" text NOT NULL,
	"email" text NOT NULL,
	"mobile" varchar(16) NOT NULL,
	"valid_till" timestamp (3) with time zone NOT NULL,
	"updated_at" timestamp (3) with time zone,
	"created_At" timestamp (3) with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ownership_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"ownership_type" text NOT NULL,
	CONSTRAINT "ownership_types_ownership_type_unique" UNIQUE("ownership_type")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_modes" (
	"id" serial PRIMARY KEY NOT NULL,
	"payment_mode" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_statuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	CONSTRAINT "payment_statuses_status_unique" UNIQUE("status")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"bill_generation_date" integer,
	"address1" text,
	"address2" text,
	"address3" text,
	"city" text,
	"state" text,
	"country" text,
	"postal_code" text,
	"project_code" text,
	"due_date" integer,
	"account_name" text,
	"account_number" text,
	"ifsc_code" text,
	"branch" text,
	"bank" text,
	"updated_at" timestamp (3) with time zone,
	"created_At" timestamp (3) with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"updated_at" timestamp (3) with time zone,
	"created_At" timestamp (3) with time zone,
	CONSTRAINT "roles_role_unique" UNIQUE("role")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"service" text NOT NULL,
	"sub_service" text NOT NULL,
	"unit_cost" numeric NOT NULL,
	"limit" text,
	"category" text NOT NULL,
	"project_id" uuid,
	"bill_generation_date" integer,
	"due_date" integer,
	"updated_at" timestamp (3) with time zone,
	"created_At" timestamp (3) with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_entities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"entity_id" uuid NOT NULL,
	"status_id" integer NOT NULL,
	"owner_ship_type" integer NOT NULL,
	"primary" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp (3) with time zone,
	"created_At" timestamp (3) with time zone,
	CONSTRAINT "user_entities_user_id_entity_id_unique" UNIQUE("user_id","entity_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"mobile" varchar(16) NOT NULL,
	"avatar" text,
	"role_id" integer NOT NULL,
	"email_verified" boolean DEFAULT false,
	"mobile_verified" boolean DEFAULT false,
	"updated_at" timestamp (3) with time zone,
	"created_At" timestamp (3) with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_mobile_unique" UNIQUE("mobile")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bills" (
	"generated_bill_id" text,
	"bill_no" text,
	"bill_date" text,
	"due_date" text,
	"project_group_name" text,
	"entity" text,
	"service" text,
	"project" text,
	"group_name" text,
	"service_subtype" text,
	"from_date" text,
	"to_date" text,
	"past_reading" text,
	"present_reading" text,
	"consumption" text,
	"unit_cost" text,
	"amount" text,
	"bill_mode" text,
	"status" text,
	"remarks" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "devices" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"model" text,
	"ip" text NOT NULL,
	"macaddress" text NOT NULL,
	"updated_at" timestamp (3) with time zone,
	"created_At" timestamp (3) with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"updated_at" timestamp (3) with time zone,
	"created_At" timestamp (3) with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities" ADD CONSTRAINT "entities_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_bills" ADD CONSTRAINT "entity_bills_service_id_entity_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."entity_services"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_bills" ADD CONSTRAINT "entity_bills_payment_status_id_payment_statuses_id_fk" FOREIGN KEY ("payment_status_id") REFERENCES "public"."payment_statuses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_bills" ADD CONSTRAINT "entity_bills_paid_by_id_users_id_fk" FOREIGN KEY ("paid_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_bills" ADD CONSTRAINT "entity_bills_payment_mode_id_payment_modes_id_fk" FOREIGN KEY ("payment_mode_id") REFERENCES "public"."payment_modes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_consumption" ADD CONSTRAINT "entity_consumption_service_id_entity_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."entity_services"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_services" ADD CONSTRAINT "entity_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_services" ADD CONSTRAINT "entity_services_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_services" ADD CONSTRAINT "entity_services_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groups" ADD CONSTRAINT "groups_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "services" ADD CONSTRAINT "services_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_entities" ADD CONSTRAINT "user_entities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_entities" ADD CONSTRAINT "user_entities_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_entities" ADD CONSTRAINT "user_entities_status_id_entity_approval_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."entity_approval_statuses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_entities" ADD CONSTRAINT "user_entities_owner_ship_type_ownership_types_id_fk" FOREIGN KEY ("owner_ship_type") REFERENCES "public"."ownership_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_admins" ADD CONSTRAINT "project_admins_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_admins" ADD CONSTRAINT "project_admins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
