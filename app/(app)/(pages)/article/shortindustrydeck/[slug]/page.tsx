import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { getShortIndustryDeckBySlug } from "@/lib/short-industry-decks";
import { DeckPdfViewer } from "@/components/modules/shortindustrydecks/PdfSlides";
import DeckActions from "@/components/modules/shortindustrydecks/DeckActions";

type PageProps = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const deck = await getShortIndustryDeckBySlug(slug);
  if (!deck) return { title: "Deck Not Found | 180 Degrees Consulting UGM" };
  return {
    title: `${deck.title} | 180 Degrees Consulting UGM`,
    description: deck.overview,
    openGraph: {
      title: deck.title,
      description: deck.overview,
      ...(deck.coverUrl ? { images: [deck.coverUrl] } : {}),
    },
  };
}

export default async function ShortIndustryDeckPage({ params }: PageProps) {
  const { slug } = await params;
  const deck = await getShortIndustryDeckBySlug(slug);
  if (!deck) notFound();

  return (
    <article className="bg-black-300 px-4 pt-32 pb-20 text-white sm:px-8 md:pt-40">
      <div className="mx-auto w-full max-w-[1100px]">
        <DeckPdfViewer url={deck.pdfUrl} title={deck.title} />
        <details
          open
          className="group mt-6 overflow-hidden rounded-b-lg border-t-2 border-green-300 bg-[#303030]"
        >
          <summary className="font-avenir-heavy flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-green-300 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-green-300 sm:px-7 [&::-webkit-details-marker]:hidden">
            Overview
            <ChevronDown
              aria-hidden="true"
              className="size-5 shrink-0 transition-transform group-open:rotate-180"
            />
          </summary>
          <p className="font-lato-regular px-5 pb-6 text-sm leading-relaxed whitespace-pre-line text-gray-200 italic select-text sm:px-7 sm:text-base">
            {deck.overview}
          </p>
        </details>
        <header className="mt-10 text-center">
          <h1 className="font-avenir-black text-2xl sm:text-3xl">{deck.title}</h1>
          {deck.subtitle && (
            <p className="font-lato-regular mt-2 text-lg text-gray-200 sm:text-xl">
              {deck.subtitle}
            </p>
          )}
        </header>
        <DeckActions slug={deck.slug} driveLink={deck.driveLink} />
      </div>
    </article>
  );
}
