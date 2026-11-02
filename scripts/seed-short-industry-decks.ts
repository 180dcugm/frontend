/**
 * Import the supplied first SID after applying the schema migration:
 *   npx payload run scripts/seed-short-industry-decks.ts
 *   npx payload run scripts/seed-short-industry-decks.ts https://drive.google.com/file/d/ID/view
 *
 * Safe to repeat: existing decks and editorial changes are preserved. A supplied
 * Drive link updates only that field on an existing EdTech deck.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

const slug = "indonesias-edtech-industry";
const driveLink = process.argv[2];
if (driveLink) {
  const url = new URL(driveLink);
  if (
    url.protocol !== "https:" ||
    !["drive.google.com", "docs.google.com"].includes(url.hostname)
  ) {
    throw new Error("Supply an HTTPS Google Drive share link.");
  }
}

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

try {
  const existing = await payload.find({
    collection: "short-industry-decks",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  const deck = existing.docs[0];
  if (deck) {
    if (driveLink && deck.driveLink !== driveLink) {
      await payload.update({
        collection: "short-industry-decks",
        id: deck.id,
        data: { driveLink },
      });
      console.log("Updated the EdTech deck's Google Drive link.");
    } else {
      console.log("The EdTech deck already exists; its content has been preserved.");
    }
  } else {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
    async function upload(filename: string, alt: string) {
      const found = await payload.find({
        collection: "media",
        where: { filename: { equals: filename } },
        limit: 1,
        depth: 0,
      });
      if (found.docs[0]) return found.docs[0].id;
      const media = await payload.create({
        collection: "media",
        data: { alt },
        filePath: path.join(root, "public", "file", "short-industry-decks", filename),
      });
      return media.id;
    }

    const pdf = await upload(
      "sid-01-edtech-industry.pdf",
      "Indonesia’s EdTech Industry — full deck"
    );
    const coverImage = await upload(
      "sid-01-edtech-cover.webp",
      "Indonesia’s EdTech Industry — cover slide"
    );
    await payload.create({
      collection: "short-industry-decks",
      data: {
        title: "Indonesia’s EdTech Industry",
        slug,
        subtitle: "Unlocking the Next Wave of Growth",
        author: "Knowledge Team",
        publishedDate: "2026-11-02T00:00:00.000Z",
        pdf,
        coverImage,
        overview:
          "This industry deck examines Indonesia’s EdTech market, covering its market size, growth outlook, competitive dynamics, business models, ecosystem, and sustainability impact. It highlights opportunities in K–12 education, software-based learning solutions, professional upskilling, and institutional partnerships, while identifying key challenges such as intense competition, low willingness to pay, digital access disparities, and data privacy risks. The analysis concludes that sustainable growth will depend on differentiated, outcome-driven solutions, broader digital access, and stronger institutional collaboration.",
        ...(driveLink ? { driveLink } : {}),
      },
    });
    console.log(
      `Created the EdTech Short Industry Deck${driveLink ? " with its Drive link" : ""}.`
    );
  }
} finally {
  await payload.destroy();
}
