// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Telescope } from "./collections/Telescope";
import { Links } from "./collections/Links";
import { TelescopeComments } from "./collections/TelescopeComments";
import { AIKnowledge } from "./collections/AIKnowledge";
import { Hero } from "./collections/Hero";
import { Partners } from "./collections/Partners";
import { ShortIndustryDecks } from "./collections/ShortIndustryDecks";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const connectionString = process.env.POSTGRES_URL || "";
const databaseURL = connectionString ? new URL(connectionString) : null;
const databaseHost = databaseURL?.hostname || "";
const isSupabase =
  databaseHost.endsWith(".pooler.supabase.com") || databaseHost.endsWith(".supabase.co");
const isVercel = process.env.VERCEL === "1";

// Serverless instances must not retain Supabase's limited session-pool slots.
// CLI migrations continue to use the supplied session connection on port 5432.
if (
  databaseURL &&
  databaseHost.endsWith(".pooler.supabase.com") &&
  isVercel &&
  process.env.PAYLOAD_MIGRATING !== "true" &&
  databaseURL.port === "5432"
) {
  databaseURL.port = "6543";
}

export const databasePool = {
  connectionString: databaseURL?.toString() || connectionString,
  // Supabase's shared pooler uses a private CA; require an encrypted connection.
  ...(isSupabase ? { ssl: { rejectUnauthorized: false } } : {}),
  ...(isVercel
    ? { max: 5, idleTimeoutMillis: 1000, connectionTimeoutMillis: 15000, allowExitOnIdle: true }
    : {}),
};

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Telescope,
    Links,
    TelescopeComments,
    Hero,
    AIKnowledge,
    Partners,
    ShortIndustryDecks,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    push: process.env.PAYLOAD_DB_PUSH !== "false",
    pool: databasePool,
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    s3Storage({
      // Opt-out so production can't lose S3 by a missing variable. Set PAYLOAD_LOCAL_UPLOADS=true
      // in a local .env to store uploads on disk (./media) instead of the production bucket.
      enabled: process.env.PAYLOAD_LOCAL_UPLOADS !== "true",
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
      },
    }),
    // storage-adapter-placeholder
  ],
});
