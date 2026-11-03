import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "short_industry_decks" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "slug" varchar NOT NULL,
    "subtitle" varchar,
    "author" varchar DEFAULT 'Knowledge Team' NOT NULL,
    "pdf_id" integer NOT NULL,
    "cover_image_id" integer,
    "overview" varchar NOT NULL,
    "drive_link" varchar,
    "published_date" timestamp(3) with time zone NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "short_industry_decks_id" integer;
  ALTER TABLE "short_industry_decks" ADD CONSTRAINT "short_industry_decks_pdf_id_media_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "short_industry_decks" ADD CONSTRAINT "short_industry_decks_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "short_industry_decks_slug_idx" ON "short_industry_decks" USING btree ("slug");
  CREATE INDEX "short_industry_decks_pdf_idx" ON "short_industry_decks" USING btree ("pdf_id");
  CREATE INDEX "short_industry_decks_cover_image_idx" ON "short_industry_decks" USING btree ("cover_image_id");
  CREATE INDEX "short_industry_decks_updated_at_idx" ON "short_industry_decks" USING btree ("updated_at");
  CREATE INDEX "short_industry_decks_created_at_idx" ON "short_industry_decks" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_short_industry_decks_fk" FOREIGN KEY ("short_industry_decks_id") REFERENCES "public"."short_industry_decks"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_short_industry_decks_id_idx" ON "payload_locked_documents_rels" USING btree ("short_industry_decks_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_short_industry_decks_fk";
  DROP INDEX "payload_locked_documents_rels_short_industry_decks_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "short_industry_decks_id";
  DROP TABLE "short_industry_decks";`);
}
