"use client";

import { Download, ExternalLink } from "lucide-react";
import { Button180Variants } from "@/components/elements/Button180";
import ContactUsButton180 from "@/components/elements/ContactUsButton180";

export default function DeckActions({
  slug,
  driveLink,
}: {
  slug: string;
  driveLink?: string | null;
}) {
  const linkClass = `${Button180Variants({ color: "green", size: "md" })} font-avenir-heavy w-full sm:w-auto sm:min-w-[180px]`;
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap lg:gap-6">
      <a href={`/article/shortindustrydeck/${slug}/download`} className={linkClass}>
        Download PDF <Download aria-hidden="true" />
      </a>
      {driveLink ? (
        <a href={driveLink} target="_blank" rel="noopener noreferrer" className={linkClass}>
          View on Drive <ExternalLink aria-hidden="true" />
        </a>
      ) : (
        <button
          type="button"
          disabled
          title="Google Drive link not available yet"
          className={linkClass}
        >
          View on Drive <ExternalLink aria-hidden="true" />
        </button>
      )}
      <ContactUsButton180 size="md" className="w-full sm:w-auto" />
    </div>
  );
}
