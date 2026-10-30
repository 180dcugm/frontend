import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_partners_category" AS ENUM('case-collaboration', 'event-collaboration', 'media-partner');
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"category" "enum_partners_category" NOT NULL,
  	"logo_id" integer,
  	"description" varchar,
  	"nps" numeric,
  	"is_recent" boolean DEFAULT false,
  	"case_study_challenge" varchar,
  	"case_study_solution" varchar,
  	"case_study_impact" varchar,
  	"case_study_background_id" integer,
  	"popup_background_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "media" ADD COLUMN "sizes_popup_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_popup_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_popup_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_popup_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_popup_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_popup_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_logo_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_logo_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_logo_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_logo_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_logo_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_logo_filename" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "partners_id" integer;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_case_study_background_id_media_id_fk" FOREIGN KEY ("case_study_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_popup_background_id_media_id_fk" FOREIGN KEY ("popup_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_case_study_case_study_background_idx" ON "partners" USING btree ("case_study_background_id");
  CREATE INDEX "partners_popup_popup_background_idx" ON "partners" USING btree ("popup_background_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_sizes_popup_sizes_popup_filename_idx" ON "media" USING btree ("sizes_popup_filename");
  CREATE INDEX "media_sizes_logo_sizes_logo_filename_idx" ON "media" USING btree ("sizes_logo_filename");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partners" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "partners" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_partners_fk";
  
  DROP INDEX "media_sizes_popup_sizes_popup_filename_idx";
  DROP INDEX "media_sizes_logo_sizes_logo_filename_idx";
  DROP INDEX "payload_locked_documents_rels_partners_id_idx";
  ALTER TABLE "media" DROP COLUMN "sizes_popup_url";
  ALTER TABLE "media" DROP COLUMN "sizes_popup_width";
  ALTER TABLE "media" DROP COLUMN "sizes_popup_height";
  ALTER TABLE "media" DROP COLUMN "sizes_popup_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_popup_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_popup_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_logo_url";
  ALTER TABLE "media" DROP COLUMN "sizes_logo_width";
  ALTER TABLE "media" DROP COLUMN "sizes_logo_height";
  ALTER TABLE "media" DROP COLUMN "sizes_logo_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_logo_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_logo_filename";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "partners_id";
  DROP TYPE "public"."enum_partners_category";`)
}
