/**
 * Import the prepared public client catalogue using the existing Payload API.
 *
 * npx payload run scripts/import-client-page.ts /path/to/manifest.json
 * npx payload run scripts/import-client-page.ts /path/to/manifest.json apply
 * npx payload run scripts/import-client-page.ts /path/to/manifest.json apply backgrounds
 *
 * The default is a dry run. Media filenames include a content hash, so repeating
 * an import reuses the same files. Existing organization names are matched before
 * updating. Only organizations explicitly retired by the manifest are removed,
 * along with their import-owned media. The importer does not modify the schema.
 */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Partner } from "../src/payload-types";

type PreparedPartner = {
  name: string;
  category: Partner["category"];
  description?: string;
  nps?: number;
  isRecent: boolean;
  logoFile?: string;
  backgroundFile: string;
  caseStudy?: { challenge: string; solution: string; impact: string };
};
type Manifest = {
  summary: Record<string, unknown>;
  partners: PreparedPartner[];
  removePartners?: string[];
};

const [manifestPath, mode = "dry-run", scope = "all"] = process.argv.slice(2);
if (
  !manifestPath ||
  !["dry-run", "apply"].includes(mode) ||
  !["all", "backgrounds"].includes(scope)
) {
  throw new Error(
    "Usage: payload run scripts/import-client-page.ts /path/to/manifest.json [dry-run|apply] [all|backgrounds]"
  );
}

const apply = mode === "apply";
const directory = path.dirname(path.resolve(manifestPath));
const manifest: Manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const identity = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const knownCategories = ["client", "case-collaboration", "event-collaboration", "media-partner"];

const assets = new Map<string, Buffer>();
const identities = new Set<string>();
for (const partner of manifest.partners) {
  const id = identity(partner.name);
  if (!id || identities.has(id)) throw new Error(`Duplicate organization: ${partner.name}`);
  identities.add(id);
  if (!knownCategories.includes(partner.category))
    throw new Error(`Unknown category for ${partner.name}`);
  if ((partner.description?.match(/\S+/g)?.length ?? 0) < 15) {
    throw new Error(`Company overview must contain at least 15 words: ${partner.name}`);
  }
  if (
    partner.isRecent &&
    (!partner.logoFile ||
      !partner.description?.trim() ||
      !partner.caseStudy?.challenge.trim() ||
      !partner.caseStudy.solution.trim() ||
      !partner.caseStudy.impact.trim() ||
      !Number.isInteger(partner.nps) ||
      partner.nps! < 0 ||
      partner.nps! > 100)
  )
    throw new Error(`Incomplete case study: ${partner.name}`);

  for (const filename of scope === "backgrounds"
    ? [partner.backgroundFile]
    : [partner.logoFile, partner.backgroundFile]) {
    if (!filename) continue;
    if (path.basename(filename) !== filename || !filename.endsWith(".webp")) {
      throw new Error(`Unexpected prepared media filename: ${filename}`);
    }
    assets.set(filename, await readFile(path.join(directory, filename)));
  }
}

for (const name of manifest.removePartners ?? []) {
  if (identities.has(identity(name)))
    throw new Error(`Organization is both imported and retired: ${name}`);
}

// Schema migrations are explicit. A content import must never silently run
// development schema-push against the configured database.
const [{ default: config }, { getPayload }, { vercelPostgresAdapter }] = await Promise.all([
  import("../src/payload.config"),
  import("payload"),
  import("@payloadcms/db-vercel-postgres"),
]);
const resolvedConfig = await config;
const payload = await getPayload({
  config: {
    ...resolvedConfig,
    db: {
      ...vercelPostgresAdapter({
        pool: { connectionString: process.env.POSTGRES_URL || "" },
        push: false,
      }),
      allowIDOnCreate: resolvedConfig.db.allowIDOnCreate,
      name: resolvedConfig.db.name,
    },
  },
});

const counts = {
  created: 0,
  updated: 0,
  unchanged: 0,
  removed: 0,
  uploaded: 0,
  reusedMedia: 0,
  removedMedia: 0,
  skipped: 0,
};
try {
  const existing = await payload.find({
    collection: "partners",
    depth: 0,
    pagination: false,
    overrideAccess: true,
  });
  const existingByName = new Map(existing.docs.map((partner) => [identity(partner.name), partner]));
  const media = await payload.find({
    collection: "media",
    depth: 0,
    pagination: false,
    overrideAccess: true,
    where: { filename: { contains: "client-page-" } },
  });
  const mediaByFilename = new Map(media.docs.map((item) => [item.filename, item.id]));

  for (const name of scope === "all" ? (manifest.removePartners ?? []) : []) {
    const found = existingByName.get(identity(name));
    if (found) {
      counts.removed++;
      if (apply)
        await payload.delete({ collection: "partners", id: found.id, overrideAccess: true });
      existingByName.delete(identity(name));
    }
    for (const item of media.docs) {
      if (!item.filename?.startsWith(`client-page-${identity(name)}-`)) continue;
      counts.removedMedia++;
      if (apply) await payload.delete({ collection: "media", id: item.id, overrideAccess: true });
      mediaByFilename.delete(item.filename);
    }
  }

  async function upload(filename: string, alt: string): Promise<number | undefined> {
    const data = assets.get(filename)!;
    const hash = createHash("sha256").update(data).digest("hex").slice(0, 12);
    const name = `client-page-${path.basename(filename, ".webp")}-${hash}.webp`;
    const found = mediaByFilename.get(name);
    if (found !== undefined) {
      counts.reusedMedia++;
      return found;
    }
    counts.uploaded++;
    if (!apply) return -1;
    const item = await payload.create({
      collection: "media",
      overrideAccess: true,
      data: { alt },
      file: { data, name, mimetype: "image/webp", size: data.length },
    });
    mediaByFilename.set(name, item.id);
    return item.id;
  }

  for (const partner of manifest.partners) {
    const found = existingByName.get(identity(partner.name));
    if (scope === "backgrounds") {
      if (!found) {
        counts.skipped++;
        continue;
      }
      const background = await upload(partner.backgroundFile, `${partner.name} company background`);
      const changed =
        found.popup?.background !== background ||
        (found.isRecent && found.caseStudy?.background !== background);
      if (changed) {
        counts.updated++;
        if (apply)
          await payload.update({
            collection: "partners",
            id: found.id,
            overrideAccess: true,
            data: {
              popup: { background },
              ...(found.isRecent && found.caseStudy
                ? { caseStudy: { ...found.caseStudy, background } }
                : {}),
            },
          });
      } else counts.unchanged++;
      continue;
    }
    const logo = partner.logoFile
      ? await upload(partner.logoFile, `${partner.name} logo`)
      : undefined;
    const background = await upload(partner.backgroundFile, `${partner.name} company background`);
    const data = {
      name: partner.name,
      category: partner.category,
      description: partner.description,
      nps: partner.nps,
      isRecent: partner.isRecent,
      ...(logo !== undefined ? { logo } : {}),
      ...(background !== undefined ? { popup: { background } } : {}),
      ...(partner.caseStudy
        ? {
            caseStudy: {
              ...partner.caseStudy,
              ...(background !== undefined ? { background } : {}),
            },
          }
        : {}),
    };
    if (!found) {
      counts.created++;
      if (apply) await payload.create({ collection: "partners", overrideAccess: true, data });
      continue;
    }
    const changed = Object.entries(data).some(([field, value]) => {
      if (value === undefined) return false;
      const current = found[field as keyof Partner];
      if (field === "popup" || field === "caseStudy") {
        return Object.entries(value as Record<string, unknown>).some(
          ([key, nested]) =>
            (current as Record<string, unknown> | null | undefined)?.[key] !== nested
        );
      }
      return current !== value;
    });
    if (changed) {
      counts.updated++;
      if (apply)
        await payload.update({ collection: "partners", id: found.id, overrideAccess: true, data });
    } else counts.unchanged++;
  }
  console.log(JSON.stringify({ mode, scope, ...counts, sourceSummary: manifest.summary }, null, 2));
} finally {
  await payload.destroy();
}
