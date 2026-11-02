import CTASection180 from "@/components/elements/CTASection180";
import PreviousClients from "@/components/modules/portofolio/PreviousClients";
import ProjectStructure from "@/components/modules/portofolio/ProjectStructure";
import { getPartners, getRecentPartners } from "@/lib/partners/getPartners";

// Partners come from Payload at render time. Without this the page is prerendered once at
// build, so CMS edits only appear after the next deploy.
export const revalidate = 60;

export const metadata = {
  title: "Services | 180 Degrees Consulting UGM",
};

export default async function Portofolio() {
  const [partners, recentPartners] = await Promise.all([getPartners(), getRecentPartners()]);

  return (
    <main>
      <PreviousClients partners={partners} recentPartners={recentPartners} />
      <ProjectStructure />
      <CTASection180 
        title={<>We Look Forward to<br/>Speaking with You</>}
        subtitle={<>Explore our different services offerings, and<br className="hidden sm:block" /> reach out to us for a discussion.</>}
        primaryButtonText="Consult Now!"
        primaryButtonHref="/apply"
      />
    </main>
  );
}
