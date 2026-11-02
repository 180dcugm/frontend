import { getShortIndustryDeckBySlug } from "@/lib/short-industry-decks";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const deck = await getShortIndustryDeckBySlug(slug);
  if (!deck) return new Response("Deck not found", { status: 404 });

  const response = await fetch(new URL(deck.pdfUrl, request.url), { cache: "no-store" });
  if (!response.ok || !response.body) {
    return new Response("The deck PDF is currently unavailable.", { status: 502 });
  }
  // An attachment response also downloads correctly when media is stored on S3.
  return new Response(response.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${deck.slug}.pdf"; filename*=UTF-8''${encodeURIComponent(deck.filename)}`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
