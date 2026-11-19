/**
 * Publish the SID #1 announcement through Payload's content API:
 *   npx payload run scripts/set-sid-release-hero.ts
 *   npx payload run scripts/set-sid-release-hero.ts once
 *
 * By default, use the configured Payload database. To use the live Payload REST
 * API instead, set PAYLOAD_API_URL, PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD
 * in the environment. The deck and its cover must already exist in that CMS.
 */
import type { Hero, ShortIndustryDeck } from "../src/payload-types";

const slug = "indonesias-edtech-industry";
// Payload forwards positional script arguments, but consumes CLI flags itself.
const once = process.argv[2] === "once";
const markerKey = "pvp:sid-01-release-hero";
// Builds use their own database connection; the REST mode is for manual publication.
const apiURL = once ? undefined : process.env.PAYLOAD_API_URL;

async function publishHero() {
  let destroy: (() => Promise<void>) | undefined;

  try {
    let deck: ShortIndustryDeck | undefined;
    let hero: Hero | undefined;
    let save: (data: Omit<Hero, "id" | "createdAt" | "updatedAt">) => Promise<Hero>;
    let markApplied: ((heroID: number) => Promise<void>) | undefined;

    if (apiURL) {
      const origin = new URL(apiURL).origin;
      const email = process.env.PAYLOAD_ADMIN_EMAIL;
      const password = process.env.PAYLOAD_ADMIN_PASSWORD;
      if (!email || !password)
        throw new Error("Set the Payload admin credentials for the target CMS.");

      const login = await fetch(`${origin}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!login.ok) throw new Error(`Payload login failed (${login.status}).`);
      const { token } = await login.json();
      if (!token) throw new Error("Payload did not return an authentication token.");

      async function request<T>(path: string, init?: RequestInit): Promise<T> {
        const response = await fetch(`${origin}/api/${path}`, {
          ...init,
          headers: { "Content-Type": "application/json", Authorization: `JWT ${token}` },
        });
        if (!response.ok) throw new Error(`Payload ${path} failed (${response.status}).`);
        return response.json();
      }

      const [decks, heroes] = await Promise.all([
        request<{ docs: ShortIndustryDeck[] }>(
          `short-industry-decks?where[slug][equals]=${slug}&limit=1&depth=1`
        ),
        request<{ docs: Hero[] }>("hero?sort=-createdAt&limit=1&depth=0"),
      ]);
      deck = decks.docs[0];
      hero = heroes.docs[0];
      save = async (data) => {
        const result = await request<{ doc: Hero }>(hero ? `hero/${hero.id}` : "hero", {
          method: hero ? "PATCH" : "POST",
          body: JSON.stringify(data),
        });
        return result.doc;
      };
    } else {
      // Content changes must not trigger development schema-push.
      process.env.PAYLOAD_DB_PUSH = "false";
      const [{ default: config }, { getPayload }] = await Promise.all([
        import("../src/payload.config"),
        import("payload"),
      ]);
      const payload = await getPayload({ config });
      destroy = () => payload.destroy();
      if (once) {
        const findMarker = () =>
          payload.find({
            collection: "payload-kv",
            where: { key: { equals: markerKey } },
            limit: 1,
            depth: 0,
          });
        if ((await findMarker()).docs.length) {
          console.log("SID #1 hero release has already been applied; CMS edits are preserved.");
          return;
        }
        markApplied = async (heroID) => {
          try {
            await payload.create({
              collection: "payload-kv",
              data: { key: markerKey, data: { heroID, appliedAt: new Date().toISOString() } },
            });
          } catch (error) {
            // Two builds can finish together; an existing marker is also success.
            if (!(await findMarker()).docs.length) throw error;
          }
        };
      }
      const [decks, heroes] = await Promise.all([
        payload.find({
          collection: "short-industry-decks",
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 1,
        }),
        payload.find({ collection: "hero", sort: "-createdAt", limit: 1, depth: 0 }),
      ]);
      deck = decks.docs[0];
      hero = heroes.docs[0];
      save = (data) =>
        hero
          ? payload.update({ collection: "hero", id: hero.id, data })
          : payload.create({ collection: "hero", data });
    }

    const coverID = typeof deck?.coverImage === "object" ? deck.coverImage?.id : deck?.coverImage;
    if (!deck || !coverID) {
      if (once) {
        console.log("SID #1 hero release is waiting for the deck and its thumbnail in this CMS.");
        return;
      }
      throw new Error("Import SID #1 and its thumbnail into the target Payload CMS first.");
    }

    const data = {
      notification: "SID #1 is out now — Indonesia’s EdTech Industry",
      newsTitle: "SID #1 is out now!",
      newsContent:
        "Indonesia’s EdTech Industry: Unlocking the Next Wave of Growth. Explore market trends, growth opportunities, and competitive insights in our first Short Industry Deck.",
      newsLink: `/article/shortindustrydeck/${slug}`,
      newsImage: coverID,
    };
    if (
      once &&
      hero &&
      !hero.newsLink?.includes("/events/oprec") &&
      hero.newsLink !== data.newsLink
    ) {
      await markApplied?.(hero.id);
      console.log(
        "The latest hero is a different campaign; its editorial content has been preserved."
      );
      return;
    }
    const changed = !hero || Object.entries(data).some(([key, value]) => hero[key] !== value);
    const saved = changed ? await save(data) : hero;
    await markApplied?.(saved.id);
    console.log(
      JSON.stringify(
        {
          target: apiURL ? new URL(apiURL).hostname : "configured Payload database",
          id: saved.id,
          newsTitle: saved.newsTitle,
          newsLink: saved.newsLink,
          status: changed ? "saved" : "already published",
        },
        null,
        2
      )
    );
  } finally {
    await destroy?.();
  }
}

await publishHero();
