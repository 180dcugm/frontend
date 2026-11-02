import { FeaturedTelescope, FeaturedReports, FeaturedDecks } from "@/components/modules/article";
import { getPayload } from "payload";
import config from "@payload-config";
import CTASection180 from "@/components/elements/CTASection180";
import PageHeader from "@/components/elements/PageHeader";
import { getShortIndustryDecks } from "@/lib/short-industry-decks";

export const metadata = {
  title: "Article Hub | 180 Degrees Consulting UGM",
};

// Reads Payload at render time, so revalidate rather than prerender once at
// build: newly published articles appear without a redeploy.
export const revalidate = 60;

export default async function ArticleHubPage() {
  const payload = await getPayload({ config });

  // Fetch only the telescope articles needed (sorted by newest, maybe limited to 3)
  const [telescope, decks] = await Promise.all([
    payload.find({
      collection: "telescope",
      sort: "-publishedDate",
      limit: 3,
    }),
    getShortIndustryDecks(3),
  ]);

  return (
    <section className="relative w-full bg-black">
      <PageHeader
        title="Our thoughts"
        subtitle="Explore our latest publications, from insightful Telescope articles and in-depth Industrial Reports to concise Short Industry Decks."
      />
      <FeaturedTelescope articles={telescope.docs} />
      <FeaturedReports />
      <FeaturedDecks decks={decks} />
      <CTASection180
        title={
          <>
            We Look Forward to
            <br />
            Speaking with You
          </>
        }
        subtitle={
          <>
            Explore our different services offerings, and
            <br className="hidden sm:block" /> reach out to us for a discussion.
          </>
        }
        primaryButtonText="Consult Now!"
        primaryButtonHref="/apply"
      />
    </section>
  );
}
