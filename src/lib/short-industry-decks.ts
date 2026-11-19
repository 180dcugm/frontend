import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type { ShortIndustryDeck } from "@/payload-types";
import { getMediaImage } from "@/lib/media-images";

export const shortIndustryDecksPath = "/article/shortindustrydeck";
export const shortIndustryDecksDescription =
  "Explore concise, data-driven insights into Indonesia’s key industries, highlighting market trends, growth opportunities, competitive dynamics, and emerging challenges.";

export type IndustryDeck = Pick<
  ShortIndustryDeck,
  "id" | "title" | "slug" | "subtitle" | "author" | "publishedDate" | "overview" | "driveLink"
> & {
  pdfUrl: string;
  filename: string;
  coverUrl: string | null;
  coverOriginalUrl?: string;
};

function toIndustryDeck(deck: ShortIndustryDeck): IndustryDeck | null {
  const pdf = typeof deck.pdf === "object" ? deck.pdf : null;
  if (!pdf?.url) return null;
  const cover = getMediaImage(deck.coverImage, "popup");
  return {
    id: deck.id,
    title: deck.title,
    slug: deck.slug,
    subtitle: deck.subtitle,
    author: deck.author,
    publishedDate: deck.publishedDate,
    overview: deck.overview,
    driveLink: deck.driveLink,
    pdfUrl: pdf.url,
    filename: pdf.filename || `${deck.slug}.pdf`,
    coverUrl: cover?.src || null,
    coverOriginalUrl: cover?.originalSrc,
  };
}

export const getShortIndustryDecks = cache(async (limit?: number): Promise<IndustryDeck[]> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "short-industry-decks",
    sort: "-publishedDate",
    depth: 1,
    ...(limit ? { limit } : { pagination: false }),
    overrideAccess: false,
  });
  return docs.map(toIndustryDeck).filter((deck): deck is IndustryDeck => deck !== null);
});

export const getShortIndustryDeckBySlug = cache(
  async (slug: string): Promise<IndustryDeck | null> => {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "short-industry-decks",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      overrideAccess: false,
    });
    return docs[0] ? toIndustryDeck(docs[0]) : null;
  }
);
