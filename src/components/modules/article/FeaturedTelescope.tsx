import React from "react";
import Link from "next/link";
import Image from "@/components/elements/ReliableImage";
import { getMediaImage } from "@/lib/media-images";
import Container from "@/components/layout/Container";
import Button180 from "@/components/elements/Button180";
import { ArrowRight } from "lucide-react";

interface FeaturedTelescopeProps {
  articles: any[];
}

export default function FeaturedTelescope({ articles }: FeaturedTelescopeProps) {
  // Only take the first 3 or 4 articles for the featured section
  const featuredArticles = articles.slice(0, 3);

  return (
    <section id="telescope" className="bg-black-300">
      <Container>
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="font-avenir-black mb-4 text-3xl text-white md:text-4xl">
              <span className="text-green-300">Telescope</span> Articles
            </h2>
            <p className="font-mulish text-gray-300">
              Curated articles discussing the latest trends, strategies, and stories in the
              consulting world.
            </p>
          </div>
          <Button180
            text="View All Telescope"
            color="white"
            href="/article/telescope"
            icon={<ArrowRight />}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredArticles.map((article: any, index: number) => {
            const image = getMediaImage(article.image, "popup");
            const dateObj = new Date(article.publishedDate);
            const dateStr = dateObj.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            });

            return (
              <Link
                key={article.id || index}
                href={`/article/telescope/${article.slug}`}
                className="group flex flex-col overflow-hidden"
              >
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
                  {image ? (
                    <Image
                      src={image.src}
                      originalSrc={image.originalSrc}
                      alt={article.title}
                      fill
                      sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) 46vw, 440px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
                    <span className="font-semibold text-green-300 uppercase">{article.author}</span>
                    <span>{dateStr}</span>
                  </div>
                  <h3 className="font-avenir-black text-xl leading-snug text-white transition-colors group-hover:text-green-300">
                    {article.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
