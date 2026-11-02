import Image from "next/image";
import DeckCard from "@/components/modules/shortindustrydecks/DeckCard";
import { getShortIndustryDecks, shortIndustryDecksDescription } from "@/lib/short-industry-decks";

export const metadata = {
  title: "Short Industry Decks | 180 Degrees Consulting UGM",
  description: shortIndustryDecksDescription,
};

export const revalidate = 60;

export default async function ShortIndustryDecksPage() {
  const decks = await getShortIndustryDecks();

  return (
    <section className="bg-black-300 relative isolate flex min-h-svh flex-col justify-center px-4 pt-36 pb-24 text-white md:px-8 md:pt-44">
      <Image
        src="/img/portofolio/hero_bg-new.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center grayscale"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/55 to-black/85" />
      <div className="mx-auto w-full max-w-[1440px]">
        <h1 className="font-avenir-black mb-12 text-center text-4xl leading-tight sm:text-5xl lg:mb-16 lg:text-[80px]">
          Short Industry Decks
        </h1>
        <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),360px))] justify-center gap-x-8 gap-y-12">
          {decks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
        {decks.length === 0 && (
          <p className="font-lato-regular text-center text-gray-300">
            New industry decks are coming soon.
          </p>
        )}
      </div>
    </section>
  );
}
