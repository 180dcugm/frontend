"use client";
import Image from "@/components/elements/ReliableImage";
import { getMediaImage } from "@/lib/media-images";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Container from "@/components/layout/Container";
import Link from "next/link";

export function Telescopes({ articles, subscribeScrollRef = null }) {
  const [search, setSearch] = useState("");
  const [currentImageSlide, setCurrentImageSlide] = useState(0);
  const scrollRef = useRef(null);
  const imageCarouselApiRef = useRef<CarouselApi>(null);

  // Ensure articles is always an array
  const safeArticles = Array.isArray(articles) ? articles : [];
  const imageArticles = safeArticles.filter((article) => article.image);

  const imagePlugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  useEffect(() => {
    if (!imageCarouselApiRef.current) return;

    imageCarouselApiRef.current.on("select", () => {
      setCurrentImageSlide(imageCarouselApiRef.current.selectedScrollSnap());
    });
  }, []);

  const scrollImagePrev = () => {
    imageCarouselApiRef.current?.scrollPrev();
  };

  const scrollImageNext = () => {
    imageCarouselApiRef.current?.scrollNext();
  };

  const scrollImageTo = (index) => {
    imageCarouselApiRef.current?.scrollTo(index);
  };

  // Sanitize slug - remove spaces and special characters
  const sanitizeSlug = (slug: string) => {
    if (!slug) return "";
    return slug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^\w\-]/g, "") // Remove special characters except hyphens
      .replace(/\-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  return (
    <div>
      <Image
        src="/img/telescope/hero_bg-c.png"
        alt="background"
        width={2000}
        height={2000}
        className="absolute inset-0 z-10 !h-screen !w-screen object-cover"
        sizes="100vw"
      />
      <Container color="dark" className="relative flex flex-col">
        {/* Hero */}

        <div className="bg-black-300 relative px-6 max-lg:pt-48 max-lg:pb-36 lg:h-screen">
          {/* Hero Background */}

          {/* Hero Content */}
          <div className="relative z-20 flex flex-col items-center gap-12 lg:h-full lg:w-full lg:justify-center">
            <h1 className="font-avenir-black text-center text-6xl leading-tight text-gray-100 lg:text-6xl">
              Telescope,
              <br />
              Our Newsletter
            </h1>
            <h2 className="font-lato-regular text-center text-sm leading-tight text-gray-100 lg:px-[27%] lg:text-lg">
              Bringing you the most up-to-date news on 180DC UGM, consulting 101, and mindfulness in
              professional workspaces. Telescope is 180DC UGM&apos;s ongoing quarterly newsletter
              you won&apos;t want to miss.
            </h2>
            <h2 className="font-lato-regular text-center text-sm leading-tight text-gray-100 lg:text-lg">
              View it here or{" "}
              <button
                className="underline"
                onClick={() => {
                  if (subscribeScrollRef?.current) {
                    subscribeScrollRef.current.scrollIntoView({
                      behavior: "smooth",
                    });
                  }
                }}
              >
                subscribe for free!
              </button>
            </h2>
            <button
              className="flex flex-col items-center text-gray-100 outline-0 max-lg:hidden"
              onClick={() => scrollRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              <h2 className="font-lato-bold text-sm">SCROLL DOWN</h2>
              <FaChevronDown className="animate-moving-pointer text-xl" />
            </button>
          </div>
        </div>

        {/* Image Gallery Carousel */}
        {imageArticles.length > 0 && (
          <div
            ref={scrollRef}
            className="relative flex flex-col items-center gap-8 px-6 py-20 lg:gap-10 lg:py-24"
          >
            <Carousel
              plugins={[imagePlugin.current]}
              className="w-full"
              opts={{
                align: "center",
                loop: true,
              }}
              setApi={(api) => (imageCarouselApiRef.current = api)}
              onMouseEnter={imagePlugin.current.stop}
              onMouseLeave={imagePlugin.current.reset}
            >
              <CarouselContent className="w-full">
                {imageArticles.map((article) => {
                  const image = getMediaImage(article.image, "popup");

                  return (
                    <CarouselItem
                      key={article.id}
                      className="basis-full sm:basis-3/4 md:basis-2/3 lg:basis-1/2"
                    >
                      <Link href={`/article/telescope/${sanitizeSlug(article.slug)}`}>
                        <div
                          className="relative w-full overflow-hidden rounded-lg"
                          style={{ aspectRatio: "16/9" }}
                        >
                          {image && (
                            <Image
                              src={image.src}
                              originalSrc={image.originalSrc}
                              alt={article.title || "article image"}
                              fill
                              sizes="(max-width: 639px) 90vw, (max-width: 1023px) 65vw, 50vw"
                              className="object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black to-transparent px-4 py-6 sm:px-6 sm:py-8">
                            <h3 className="font-avenir-black line-clamp-2 text-lg text-white sm:text-xl md:text-2xl">
                              {article.title}
                            </h3>
                            {article.author && (
                              <p className="font-lato-regular mt-2 text-sm text-gray-300 sm:text-base">
                                by {article.author}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>

            {/* Image Carousel Controls */}
            {imageArticles.length > 1 && (
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                <button
                  onClick={scrollImagePrev}
                  className="hover:text-black-300 rounded-full border border-gray-100 p-2 text-gray-100 transition-all hover:bg-gray-100 sm:p-3"
                >
                  <FaChevronLeft className="text-lg sm:text-xl" />
                </button>

                <div className="flex items-center gap-2 sm:gap-3">
                  {imageArticles.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollImageTo(idx)}
                      className={`h-2 rounded-full transition-all sm:h-3 ${
                        idx === currentImageSlide
                          ? "w-6 bg-green-300 sm:w-8"
                          : "w-2 bg-gray-100/40 hover:bg-gray-100/60 sm:w-3"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={scrollImageNext}
                  className="hover:text-black-300 rounded-full border border-gray-100 p-2 text-gray-100 transition-all hover:bg-gray-100 sm:p-3"
                >
                  <FaChevronRight className="text-lg sm:text-xl" />
                </button>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
