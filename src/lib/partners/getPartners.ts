import { getPayload } from "payload";
import config from "@payload-config";
import type { Media, Partner as PayloadPartner } from "@/payload-types";
import type { Partner, PartnerCaseStudy, PartnerMedia, RecentPartner } from "./types";

// Upload fields come back as a Media object at depth 1, but as a bare ID (or null) when the
// file was deleted or not populated. Prefer the named image size, falling back to the
// original for files uploaded before the size existed.
const toPartnerMedia = (
  value: number | Media | null | undefined,
  size?: keyof NonNullable<Media["sizes"]>
): PartnerMedia | undefined => {
  if (!value || typeof value === "number") return undefined;

  const url = (size && value.sizes?.[size]?.url) || value.url;
  if (!url) return undefined;

  return { url, alt: value.alt };
};

// Payload's generated type marks these fields required, but they are only enforced while the
// partner is recent, so a partner that was un-flagged and flagged again could still lack them.
const toCaseStudy = (doc: PayloadPartner): PartnerCaseStudy | undefined => {
  const { nps } = doc;
  const { challenge, solution, impact, background } = doc.caseStudy ?? {};
  if (typeof nps !== "number" || !challenge?.trim() || !solution?.trim() || !impact?.trim()) {
    return undefined;
  }

  return {
    nps,
    challenge: challenge.trim(),
    solution: solution.trim(),
    impact: impact.trim(),
    background: toPartnerMedia(background, "popup"),
  };
};

const toPartner = (doc: PayloadPartner): Partner | undefined => {
  const logo = toPartnerMedia(doc.logo, "logo");
  // A card without a logo can't render, so skip it rather than ship a broken entry.
  if (!logo) return undefined;

  const partner: Partner = {
    id: doc.id,
    name: doc.name,
    category: doc.category,
    logo,
    isRecent: Boolean(doc.isRecent),
  };

  const description = doc.description?.trim();
  if (description) partner.description = description;

  const background = toPartnerMedia(doc.popup?.background, "popup");
  if (background) partner.popup = { background };

  if (partner.isRecent) {
    const caseStudy = toCaseStudy(doc);
    if (caseStudy) partner.caseStudy = caseStudy;
  }

  return partner;
};

const findPartners = async (options: { recentOnly: boolean }) => {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "partners",
    depth: 1,
    pagination: false,
    ...(options.recentOnly
      ? { where: { isRecent: { equals: true } }, sort: "-createdAt" }
      : { sort: "name" }),
  });

  return result.docs.map(toPartner).filter((partner): partner is Partner => Boolean(partner));
};

// Server-only: these use the Payload Local API. Call them from a server component and pass the
// results down as props.

// Every partner, recent ones included, for the Our Partners grid. Sorted by name; the frontend
// is free to re-order.
export async function getPartners(): Promise<Partner[]> {
  return findPartners({ recentOnly: false });
}

// Recent partners with a description and a complete case study, for the Recent Partners
// carousel. Newest first, by when the partner was added to the CMS.
export async function getRecentPartners(): Promise<RecentPartner[]> {
  const partners = await findPartners({ recentOnly: true });
  return partners.filter((partner): partner is RecentPartner =>
    Boolean(partner.description && partner.caseStudy)
  );
}
