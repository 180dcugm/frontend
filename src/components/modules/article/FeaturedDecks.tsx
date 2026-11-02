import { ArrowRight } from "lucide-react";
import Button180 from "@/components/elements/Button180";
import Container from "@/components/layout/Container";
import DeckCard from "@/components/modules/shortindustrydecks/DeckCard";
import {
  shortIndustryDecksDescription,
  shortIndustryDecksPath,
  type IndustryDeck,
} from "@/lib/short-industry-decks";

export default function FeaturedDecks({ decks }: { decks: IndustryDeck[] }) {
  return (
    <section id="short-industry-decks" className="bg-black-300 py-10 md:py-20">
      <Container>
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="font-avenir-black mb-4 text-3xl text-white md:text-4xl">
              <span className="text-green-300">Short Industry</span> Decks
            </h2>
            <p className="font-mulish text-gray-300">{shortIndustryDecksDescription}</p>
          </div>
          <Button180
            text="View all Decks"
            color="white"
            href={shortIndustryDecksPath}
            icon={<ArrowRight />}
          />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
        {decks.length === 0 && (
          <p className="font-lato-regular text-gray-400">New industry decks are coming soon.</p>
        )}
      </Container>
    </section>
  );
}
