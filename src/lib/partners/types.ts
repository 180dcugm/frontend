import type { Partner as PayloadPartner } from "@/payload-types";

// Data contract for the Our Partners section. The frontend builds against these types;
// getPartners() is the only place that maps Payload documents into them.

export type PartnerCategory = PayloadPartner["category"];

export type PartnerMedia = {
  // Relative URL served by Payload (/api/media/file/...), works locally and in production.
  url: string;
  alt: string;
};

export type PartnerCaseStudy = {
  // Whole percentage; render as "NPS of {nps}%".
  nps: number;
  challenge: string;
  solution: string;
  impact: string;
  background?: PartnerMedia;
};

export type Partner = {
  id: number;
  name: string;
  category: PartnerCategory;
  logo: PartnerMedia;
  // Shown in the popup, and on the carousel card for recent partners.
  description?: string;
  isRecent: boolean;
  // Recent partners only; shown on their card in the Recent Partners carousel.
  caseStudy?: PartnerCaseStudy;
  // Omitted when the partner has no popup background yet.
  popup?: {
    background: PartnerMedia;
  };
};

export type RecentPartner = Partner & {
  isRecent: true;
  description: string;
  caseStudy: PartnerCaseStudy;
};
