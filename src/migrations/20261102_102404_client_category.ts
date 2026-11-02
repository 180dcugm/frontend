import { type MigrateUpArgs, type MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_partners_category" ADD VALUE IF NOT EXISTS 'client' BEFORE 'case-collaboration';`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
     IF EXISTS (SELECT 1 FROM "partners" WHERE "category"::text = 'client') THEN
       RAISE EXCEPTION 'Reclassify client records before rolling back the Clients category';
     END IF;
   END $$;
   ALTER TABLE "partners" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_partners_category";
  CREATE TYPE "public"."enum_partners_category" AS ENUM('case-collaboration', 'event-collaboration', 'media-partner');
  ALTER TABLE "partners" ALTER COLUMN "category" SET DATA TYPE "public"."enum_partners_category" USING "category"::"public"."enum_partners_category";`);
}
