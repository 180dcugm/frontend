import Image from "next/image";
import Link from "next/link";
import { shortIndustryDecksPath, type IndustryDeck } from "@/lib/short-industry-decks";
import { PdfCover } from "./PdfSlides";

export default function DeckCard({ deck }: { deck: IndustryDeck }) {
  const date = new Date(deck.publishedDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <Link
      href={`${shortIndustryDecksPath}/${deck.slug}`}
      className="group flex min-w-0 flex-col rounded-xl focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-green-300"
    >
      <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-xl bg-white/10 shadow-lg transition-transform duration-500 group-hover:-translate-y-1">
        {deck.coverUrl ? (
          <Image
            src={deck.coverUrl}
            alt={`${deck.title} — cover slide`}
            fill
            sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) 45vw, 440px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <PdfCover url={deck.pdfUrl} title={deck.title} />
        )}
      </div>
      <div className="font-lato-regular mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-gray-400">
        <span className="font-lato-bold text-green-300 uppercase">{deck.author}</span>
        <time dateTime={deck.publishedDate}>{date}</time>
      </div>
      <h3 className="font-avenir-heavy text-xl leading-snug text-white transition-colors group-hover:text-green-300">
        {deck.title}
        {deck.subtitle ? `: ${deck.subtitle}` : ""}
      </h3>
    </Link>
  );
}
