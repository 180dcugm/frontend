"use client";

// Import Packages
import { useCallback, useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";

// Import Components
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import ImageAction from "@/components/elements/ImageAction";
import Container from "@/components/layout/Container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Partner, PartnerCategory, RecentPartner } from "@/lib/partners/types";

type PreviousClientsProps = {
  // From getPartners() and getRecentPartners(), fetched by the services page.
  partners?: Partner[];
  recentPartners?: RecentPartner[];
};

type PartnerFilter = "all" | PartnerCategory;

// Values match the `category` options in the partners collection.
const filters: { label: string; value: PartnerFilter }[] = [
  { label: "All", value: "all" },
  { label: "Case Collaboration", value: "case-collaboration" },
  { label: "Event Collaboration", value: "event-collaboration" },
  { label: "Media Partner", value: "media-partner" },
];

export default function PreviousClients({
  partners = [],
  recentPartners = [],
}: PreviousClientsProps) {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [activeFilter, setActiveFilter] = useState<PartnerFilter>("all");
  const [isMounted, setIsMounted] = useState(false);
  const [desktopApi, setDesktopApi] = useState<any>(null);
  const [mobileApi, setMobileApi] = useState<any>(null);
  const [selectedDesktopIndex, setSelectedDesktopIndex] = useState(0);
  const [desktopSnapCount, setDesktopSnapCount] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setDesktopCarouselApi = useCallback((api: any) => {
    setDesktopApi(api);
  }, []);

  const setMobileCarouselApi = useCallback((api: any) => {
    setMobileApi(api);
  }, []);

  // Pagination: update active dot when the desktop carousel slides
  useEffect(() => {
    if (!desktopApi) return;

    const updateIndex = () => {
      setSelectedDesktopIndex(desktopApi.selectedScrollSnap());
    };

    updateIndex();

    desktopApi.on("select", updateIndex);
    desktopApi.on("reInit", updateIndex);

    return () => {
      desktopApi.off("select", updateIndex);
      desktopApi.off("reInit", updateIndex);
    };
  }, [desktopApi]);

  const handleExploreClick = () => {
    document.getElementById("our-partners")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToCarousel = () => {
    document.getElementById("previous-clients-carousel")?.scrollIntoView({ behavior: "smooth" });
  };

  const safePartners = Array.isArray(partners) ? partners : [];
  const safeRecentPartners = Array.isArray(recentPartners) ? recentPartners : [];

  const visiblePartners = safePartners.filter((partner) => {
    if (activeFilter === "all") return true;
    return partner.category === activeFilter;
  });

  const partnerPopup = selectedPartner ? (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onClick={() => setSelectedPartner(null)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${selectedPartner.name} details`}
        className="relative max-h-[85vh] w-full max-w-[680px] overflow-y-auto rounded-2xl border border-[#83bd61]/60 bg-[#202020] p-6 text-white sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close popup"
          onClick={() => setSelectedPartner(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FaTimes size={18} />
        </button>

        <div className="grid grid-cols-1 items-center gap-8 pr-2 sm:grid-cols-[1fr_180px] sm:gap-10">
          <div>
            <h2 className="pr-6 text-2xl font-bold break-words text-[#83bd61] sm:text-3xl">
              {selectedPartner.name}
            </h2>

            {selectedPartner.description ? (
              <p className="mt-4 text-sm leading-6 whitespace-pre-line text-gray-200">
                {selectedPartner.description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#83bd61]/50 bg-[#292929]">
              {selectedPartner.logo?.url ? (
                <img
                  src={selectedPartner.logo.url}
                  alt={selectedPartner.logo.alt || `${selectedPartner.name} logo`}
                  className="h-full w-full object-contain p-3"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen bg-[#202020] text-white">
      {/* Hero background */}
      <div className="pointer-events-none absolute inset-0">
        <ImageAction
          heightPtg="100%"
          alt="Dark architectural background"
          src="/img/portofolio/hero_bg-c.png"
        />
        <div className="absolute inset-0 bg-[#171717]/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
      </div>

      {/* Hero: Partnerships that Drive Impact */}
      <Container color="dark" className="relative z-10">
        <section className="flex min-h-[520px] flex-col items-center justify-center px-5 py-16 text-center sm:min-h-[600px] sm:px-8">
          <h1 className="font-avenir-black max-w-3xl text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
            Partnerships that
            <br />
            Drive{" "}
            <span className="bg-gradient-to-r from-[#83bd8b] to-[#64b6c4] bg-clip-text text-transparent">
              Impact
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
            We collaborate with organizations across diverse sectors to deliver strategic,
            data-driven solutions that create meaningful and measurable impact.
          </p>

          <div className="mt-9 grid w-full max-w-[620px] grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { number: "50+", label: "Partners" },
              { number: "450", label: "Projects Completed" },
              { number: "3", label: "Sectors" },
              { number: "5+", label: "Years Active" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-white/30 bg-black/35 px-2 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#83bd8b]/70"
              >
                <span className="font-avenir-black text-3xl text-[#83bd62] sm:text-4xl">
                  {item.number}
                </span>
                <span className="mt-2 text-center text-[10px] text-gray-300 sm:text-xs">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </Container>

      {/* Previous Clients section */}
      <div className="relative">
        {/* Background */}
        <div className="absolute z-1 h-screen w-full overflow-hidden">
          <ImageAction
            heightPtg="100%"
            alt="portofolio hero background"
            src="/img/portofolio/hero_bg-c.png"
          />
        </div>

        <div className="to-black-300 absolute z-2 h-screen w-full bg-gradient-to-b from-transparent from-70% to-90%" />
        <div className="bg-black-300 absolute z-2 h-screen w-full opacity-[75.45%]" />

        <Container color="dark" className="relative">
          {/* Section title */}
          <div className="relative flex min-h-screen w-full flex-col items-center justify-center max-lg:gap-8 max-lg:px-8 lg:min-h-screen">
            <h1 className="font-avenir-black z-3 text-center text-4xl leading-tight text-gray-100 sm:text-5xl md:text-6xl lg:text-7xl">
              Our Previous Clients
            </h1>

            {/* Scroll Down */}
            <button
              type="button"
              onClick={handleScrollToCarousel}
              aria-label="Scroll down to previous clients carousel"
              className="z-3 flex flex-col items-center outline-0"
            >
              <span className="font-lato-bold mt-4 text-sm text-gray-100 max-lg:hidden sm:text-base md:text-lg">
                SCROLL DOWN
              </span>
              <FaChevronDown className="animate-moving-pointer text-lg text-gray-100 sm:text-2xl md:text-3xl" />
            </button>
          </div>
        </Container>

        {/* Carousel background (hidden until the CMS has recent partners) */}
        {safeRecentPartners.length > 0 ? (
          <div className="relative">
            <div className="absolute inset-0 z-[1] h-full w-full overflow-clip">
              <ImageAction alt="portofolio hero background" src="/img/portofolio/hero_bg-c.png" />
            </div>

            <div className="absolute z-[1] h-full w-full bg-gradient-to-b from-black/20 via-transparent to-black/90" />
            <div className="absolute top-0 z-[1] h-full w-full bg-black/85" />

            <Container color="dark" className="relative z-[2]">
              {/* Title: Recent Partners */}
              <div className="mb-6 w-full px-6 pt-8 lg:px-0">
                <h2 className="font-avenir-black text-2xl sm:text-3xl">
                  Recent{" "}
                  <span className="bg-gradient-to-r from-[#83bd61] to-[#68b8c4] bg-clip-text text-transparent">
                    Partners
                  </span>
                </h2>
              </div>
              {/* Desktop carousel */}
              <div
                id="previous-clients-carousel"
                className="relative hidden w-full flex-col items-center justify-center px-6 lg:flex"
              >
                <div className="h-full w-full 2xl:w-[1536px]">
                  <div className="relative flex h-[85%] w-full items-end justify-center pb-2">
                    <Carousel
                      opts={{
                        align: "start",
                        loop: true,
                        slidesToScroll: 1,
                      }}
                      plugins={[Autoplay({ delay: 5000 })]}
                      setApi={setDesktopCarouselApi}
                      className="w-full"
                    >
                      <CarouselContent className="-ml-4">
                        {safeRecentPartners.map((client) => (
                          <CarouselItem key={client.id} className="basis-1/2 pl-4">
                            <div className="w-full">
                              <div className="relative h-96 w-full lg:h-[500px] xl:h-[600px] 2xl:h-[700px]">
                                {/* Card background */}
                                <div className="absolute h-1/2 w-full rounded-lg rounded-bl-none lg:rounded-xl 2xl:rounded-2xl">
                                  <div className="relative h-full w-full bg-[#0A1E22]/47" />
                                </div>

                                {/* Upper body */}
                                <div className="relative mt-4 flex h-1/2 w-full gap-4 p-4 lg:mt-6 lg:gap-8 lg:p-6 xl:gap-12 2xl:p-8">
                                  <div className="relative flex h-full w-7/12 flex-col items-start justify-start gap-2 lg:gap-4">
                                    <p className="font-avenir-black text-lg leading-none text-green-300 lg:text-2xl 2xl:text-3xl">
                                      {client.name}
                                    </p>

                                    <div className="font-avenir-light text-sm leading-none text-cyan-300 lg:text-base 2xl:text-lg">
                                      <h2 className="font-avenir-black text-gray-100">
                                        {client.description}
                                      </h2>
                                      <p>
                                        <strong className="font-avenir-heavy absolute bottom-0 text-base lg:text-xl 2xl:text-2xl">
                                          NPS of {client.caseStudy.nps}%
                                        </strong>
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex h-full w-5/12 items-center justify-center">
                                    <div className="flex w-4/5 overflow-clip rounded-lg lg:rounded-xl 2xl:rounded-2xl">
                                      <ImageAction
                                        alt={client.logo.alt || `${client.name} logo`}
                                        src={client.logo.url}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Lower body */}
                                <div className="mt-4 flex h-full w-full gap-4 px-4 pb-32 lg:mt-6 lg:gap-6 lg:px-6 lg:pb-40 2xl:gap-8 2xl:px-8 2xl:pb-48">
                                  <div className="font-lato-regular w-4/12 text-justify text-xs leading-relaxed text-gray-100 lg:text-sm 2xl:text-base">
                                    <p className="font-avenir-black mb-2 text-green-300 lg:mb-3">
                                      What challenges does {client.name} face?
                                    </p>
                                    <p>{client.caseStudy.challenge}</p>
                                  </div>

                                  <div className="font-lato-regular w-4/12 text-justify text-xs leading-relaxed text-gray-100 lg:text-sm 2xl:text-base">
                                    <p className="font-avenir-black mb-2 text-green-300 lg:mb-3">
                                      What solution do we offer?
                                    </p>
                                    <p>{client.caseStudy.solution}</p>
                                  </div>

                                  <div className="font-lato-regular w-4/12 text-justify text-xs leading-relaxed text-gray-100 lg:text-sm 2xl:text-base">
                                    <p className="font-avenir-black mb-2 text-green-300 lg:mb-3">
                                      Impact that we deliver
                                    </p>
                                    <p>{client.caseStudy.impact}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>

                      <CarouselPrevious className="left-4 z-10 hidden rounded-[10px] bg-green-300/80 hover:bg-green-300 lg:flex" />
                      <CarouselNext className="right-4 z-10 hidden rounded-[10px] bg-green-300/80 hover:bg-green-300 lg:flex" />
                    </Carousel>
                  </div>

                  {/* Carousel navigation buttons */}
                  <div className="mt-1 flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      aria-label="Previous slide"
                      onClick={() => desktopApi?.scrollPrev()}
                      className="mr-1 text-white transition-opacity hover:opacity-60"
                    >
                      <FaChevronLeft size={14} />
                    </button>

                    {Array.from({ length: desktopApi?.scrollSnapList().length ?? 0 }).map(
                      (_, index) => (
                        <button
                          key={index}
                          type="button"
                          aria-label={`Go to slide ${index + 1}`}
                          onClick={() => desktopApi?.scrollTo(index)}
                          className={`h-2.5 w-2.5 rounded-full transition-colors ${
                            desktopApi?.selectedScrollSnap() === index ? "bg-[#83bd61]" : "bg-white"
                          }`}
                        />
                      )
                    )}

                    <button
                      type="button"
                      aria-label="Next slide"
                      onClick={() => desktopApi?.scrollNext()}
                      className="ml-1 text-white transition-opacity hover:opacity-60"
                    >
                      <FaChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile carousel */}
              <div className="z-[4] h-fit w-full lg:hidden">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  plugins={[Autoplay({ delay: 5000 })]}
                  setApi={setMobileCarouselApi}
                >
                  <CarouselContent>
                    {safeRecentPartners.map((client) => (
                      <CarouselItem key={client.id} className="basis-full">
                        <div className="relative h-96 overflow-clip rounded-[14px] sm:min-h-screen md:h-full">
                          <div className="absolute -z-[1] h-full w-full">
                            <div className="relative h-full w-full bg-[#2C6970]/47" />
                          </div>

                          <div className="flex h-full w-full items-center justify-center px-2 py-4 sm:px-4">
                            <button
                              type="button"
                              aria-label="Previous client"
                              className="mr-2 w-fit shrink-0 sm:mr-4"
                              onClick={() => mobileApi?.scrollPrev()}
                            >
                              <FaChevronLeft className="text-4xl text-gray-100/35 sm:text-5xl md:text-6xl" />
                            </button>

                            <div className="flex h-full w-full flex-col items-center justify-center gap-8 overflow-clip sm:gap-12">
                              <div className="relative mt-4 flex h-1/3 w-full gap-4 sm:mt-6 sm:gap-6">
                                <div className="flex h-full w-1/3 items-center justify-end sm:w-2/5">
                                  <div className="flex w-full overflow-clip rounded-2xl sm:rounded-3xl">
                                    <ImageAction
                                      alt={client.logo.alt || `${client.name} logo`}
                                      src={client.logo.url}
                                    />
                                  </div>
                                </div>

                                <div className="flex h-full flex-col items-start justify-center gap-2 sm:gap-3">
                                  <p className="font-avenir-black text-2xl leading-none text-green-300 sm:text-3xl md:text-4xl">
                                    {client.name}
                                  </p>
                                </div>
                              </div>

                              <div className="flex h-3/5 w-full flex-col gap-4 overflow-y-scroll px-4 sm:gap-6 sm:px-6">
                                <div className="font-lato-regular text-justify text-sm leading-relaxed text-gray-100 sm:text-base md:text-lg">
                                  <p className="font-avenir-black mb-2 text-green-300">
                                    What challenges does {client.name} face?
                                  </p>
                                  <p>{client.caseStudy.challenge}</p>
                                </div>

                                <div className="font-lato-regular text-sm leading-relaxed text-gray-100 sm:text-base md:text-lg">
                                  <p className="font-avenir-black mb-2 text-green-300">
                                    What solution do we offer?
                                  </p>
                                  <p>{client.caseStudy.solution}</p>
                                </div>

                                <div className="font-lato-regular text-sm leading-relaxed text-gray-100 sm:text-base md:text-lg">
                                  <p className="font-avenir-black mb-2 text-green-300">
                                    Impact that we deliver
                                  </p>
                                  <p>{client.caseStudy.impact}</p>
                                </div>
                              </div>

                              <div className="h-1/12">
                                <p className="font-lato-light-italic text-sm text-gray-100 sm:text-base">
                                  Slide For More
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              aria-label="Next client"
                              className="ml-2 w-fit shrink-0 sm:ml-4"
                              onClick={() => mobileApi?.scrollNext()}
                            >
                              <FaChevronRight className="w-fit text-4xl text-gray-100/35 sm:text-5xl md:text-6xl" />
                            </button>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </Container>
          </div>
        ) : null}
      </div>

      {/* Our Partners */}
      <section
        id="our-partners"
        className="relative z-10 scroll-mt-6 px-5 pt-8 pb-16 sm:px-8 lg:px-12 lg:pb-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-avenir-black text-2xl sm:text-3xl">
              Our{" "}
              <span className="bg-gradient-to-r from-[#83bd61] to-[#68b8c4] bg-clip-text text-transparent">
                Partners
              </span>
            </h2>

            <div className="flex flex-wrap items-center gap-1 rounded-full bg-[#171717]/90 p-1">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  aria-pressed={activeFilter === filter.value}
                  className={`rounded-full px-5 py-2.5 text-sm whitespace-nowrap transition-colors duration-200 ${
                    activeFilter === filter.value
                      ? "bg-[#83bd61] text-white"
                      : "text-gray-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {visiblePartners.length > 0 ? (
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2 md:grid-cols-4 lg:grid-cols-5">
              {visiblePartners.map((partner) => (
                <button
                  key={partner.id}
                  type="button"
                  onClick={() => setSelectedPartner(partner)}
                  aria-label={`View details for ${partner.name}`}
                  className="group flex aspect-[1.2/1] w-full flex-col items-center justify-center rounded-[22px] border border-[#83bd61]/60 bg-[#202020] px-3 py-4 text-center shadow-[0_3px_0_rgba(131,189,97,0.12)] transition-all duration-200 hover:border-[#83bd61] hover:bg-[#242824] hover:shadow-[0_4px_12px_rgba(131,189,97,0.12)] focus-visible:ring-2 focus-visible:ring-[#83bd61] focus-visible:outline-none"
                >
                  <div className="mb-3 flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-[15px] border border-[#83bd61]/70 bg-[#252525] shadow-[0_2px_5px_rgba(131,189,97,0.15)]">
                    {partner.logo?.url ? (
                      <img
                        src={partner.logo.url}
                        alt={partner.logo.alt || `${partner.name} logo`}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : null}
                  </div>

                  <span className="line-clamp-2 text-xs leading-snug font-medium text-white sm:text-sm">
                    {partner.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-gray-400">
              No partners available in this category.
            </p>
          )}
        </div>
      </section>

      {partnerPopup}
    </div>
  );
}
