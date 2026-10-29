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

// Card background for recent partners that don't have one in the CMS yet.
const fallbackCardBackground = "/img/portofolio/hero_bg-new.jpg";

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
    <div
      className="relative min-h-screen bg-[#202020] bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: "url('/img/portofolio/hero_bg-new.jpg')",
      }}
    >
      {/* Dark overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/60" />

      {/* Hero: Partnerships that Drive Impact */}
      <Container className="relative z-10">
        <section className="flex min-h-[520px] flex-col items-center justify-center px-5 py-16 text-center sm:min-h-[600px] sm:px-8">
          <h1 className="font-avenir-black max-w-3xl text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
            Partnerships that
            <br />
            Drive{" "}
            <span className="bg-gradient-to-r from-[#6FAA26] to-[#58B9D1] bg-clip-text text-transparent">
              Impact
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
            We collaborate with organizations across diverse sectors to deliver strategic,
            data-driven solutions that create meaningful and measurable impact.
          </p>

          <div className="mt-9 grid w-full max-w-[620px] grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              {
                number: "50+",
                label: "Partners",
                image: "/img/portofolio/statistics/partners_statistics.jpg",
              },
              {
                number: "450",
                label: "Projects Completed",
                image: "/img/portofolio/statistics/projects_statistics.jpg",
              },
              {
                number: "3",
                label: "Sectors",
                image: "/img/portofolio/statistics/impactful_statistics.jpg",
              },
              {
                number: "5+",
                label: "Years Active",
                image: "/img/portofolio/statistics/years_statistics.png",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/50 bg-black/10 px-2 shadow-[5px_7px_3px_#58B9D140] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#83bd8b]/80"
                style={{
                  backgroundImage: `linear-gradient(rgba(10, 15, 18, 0.58), rgba(10, 15, 18, 0.68)), url("${item.image}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <span className="font-avenir-black bg-gradient-to-b from-[#6FAA26] to-[#58B9D1] bg-clip-text text-4xl text-transparent sm:text-5xl lg:text-6xl">
                  {item.number}
                </span>

                <span className="mt-2 text-center text-[10px] text-gray-200 sm:text-xs">
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
        <div className="absolute z-1 h-screen w-full overflow-hidden"></div>

        <Container className="relative">
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
          <div className="relative isolate">
            {/* Recent Partners mirrored background */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
            >
              {/* Mirrored image */}
              <div
                className="absolute inset-x-0 top-0 h-full"
                style={{
                  backgroundImage: "url('/img/portofolio/hero_bg-new.jpg')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% auto",
                  backgroundPosition: "center center",
                  transform: "scaleY(-1)",
                  transformOrigin: "center center",
                  opacity: 1,
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-black/60" />
            </div>

            {/* Recent Partners content */}
            <Container color="dark" className="relative z-[2] !bg-transparent">
              <div className="mb-6 w-full px-6 pt-8 lg:px-0">
                <h2 className="font-avenir-black text-2xl sm:text-3xl">
                  Recent{" "}
                  <span className="bg-gradient-to-r from-[#6FAA26] to-[#58B9D1] bg-clip-text text-transparent">
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
                            <div className="relative flex h-[400px] flex-col overflow-hidden rounded-2xl xl:h-[500px] 2xl:h-[600px]">
                              {/* Upper section: background image, partner info and logo */}
                              <div
                                className="relative h-[45%] shrink-0 overflow-hidden rounded-t-2xl border-b border-white/15 bg-cover bg-center"
                                style={{
                                  backgroundImage: `linear-gradient(rgba(5, 13, 15, 0.42), rgba(5, 13, 15, 0.58)), url("${client.caseStudy.background?.url || fallbackCardBackground}")`,
                                }}
                              >
                                <div className="relative z-10 flex h-full items-center gap-4 p-5 lg:gap-6 lg:p-6 2xl:p-8">
                                  {/* Partner name, description and NPS */}
                                  <div className="flex h-full min-w-0 flex-1 flex-col items-start">
                                    <h2 className="font-avenir-black text-xl leading-tight text-[#83bd62] lg:text-2xl 2xl:text-3xl">
                                      {client.name}
                                    </h2>

                                    <p className="mt-3 text-sm leading-relaxed text-gray-100 lg:text-base 2xl:text-lg">
                                      {client.description}
                                    </p>

                                    <p className="font-avenir-heavy mt-auto pt-3 text-lg text-[#78bfd0] lg:text-xl 2xl:text-2xl">
                                      NPS of {client.caseStudy.nps}%
                                    </p>
                                  </div>

                                  {/* Partner logo */}
                                  <div className="rounded-6xl flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden p-3 lg:h-50 lg:w-50 2xl:h-54 2xl:w-54">
                                    <ImageAction
                                      alt={client.logo.alt || `${client.name} logo`}
                                      src={client.logo.url}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Lower section */}
                              <div className="relative min-h-0 flex-1 bg-[#A7CDD1]/10">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.025] via-transparent to-black/20" />

                                <div className="relative z-10 grid h-full grid-cols-3 gap-4 overflow-y-auto p-5 lg:gap-5 lg:p-6 2xl:gap-8 2xl:p-8">
                                  <div className="min-w-0 text-xs leading-relaxed text-gray-100 lg:text-sm 2xl:text-base">
                                    <p className="font-avenir-black mb-3 text-[#83bd62]">
                                      What challenges does {client.name} face?
                                    </p>
                                    <p>{client.caseStudy.challenge}</p>
                                  </div>

                                  <div className="min-w-0 text-xs leading-relaxed text-gray-100 lg:text-sm 2xl:text-base">
                                    <p className="font-avenir-black mb-3 text-[#83bd62]">
                                      What solution do we offer?
                                    </p>
                                    <p>{client.caseStudy.solution}</p>
                                  </div>

                                  <div className="min-w-0 text-xs leading-relaxed text-gray-100 lg:text-sm 2xl:text-base">
                                    <p className="font-avenir-black mb-3 text-[#83bd62]">
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

                      <CarouselPrevious className="left-4 z-20 hidden rounded-[10px] border border-white/70 bg-[#83bd62]/90 hover:bg-[#83bd62] lg:flex" />
                      <CarouselNext className="right-4 z-20 hidden rounded-[10px] border border-white/70 bg-[#83bd62]/90 hover:bg-[#83bd62] lg:flex" />
                    </Carousel>
                  </div>
                </div>
              </div>

              {/* Mobile carousel: same visual design as desktop */}
              <div className="relative z-[4] h-fit w-full lg:hidden">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                    slidesToScroll: 1,
                  }}
                  plugins={[Autoplay({ delay: 5000 })]}
                  setApi={setMobileCarouselApi}
                  className="w-full"
                >
                  <CarouselContent className="-ml-3">
                    {safeRecentPartners.map((client, idx) => (
                      <CarouselItem key={client.id} className="basis-full pl-3">
                        <div className="relative mx-3 flex h-[680px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#202020]/70 sm:mx-4 sm:h-[760px]">
                          {/* Upper section: background image, partner info and logo */}
                          <div
                            className="relative h-[35%] min-h-[220px] shrink-0 overflow-hidden rounded-t-2xl border-b border-white/15 bg-cover bg-center"
                            style={{
                              backgroundImage: `linear-gradient(rgba(5, 13, 15, 0.42), rgba(5, 13, 15, 0.58)), url("${client.caseStudy.background?.url || fallbackCardBackground}")`,
                            }}
                          >
                            <div className="relative z-10 flex h-full items-center gap-3 p-4 sm:gap-5 sm:p-6">
                              {/* Partner name, description and NPS */}
                              <div className="flex h-full min-w-0 flex-1 flex-col items-start">
                                <h2 className="font-avenir-black text-lg leading-tight text-[#83bd62] sm:text-2xl">
                                  {client.name}
                                </h2>

                                <p className="mt-2 text-xs leading-relaxed text-gray-100 sm:mt-3 sm:text-sm">
                                  {client.description}
                                </p>

                                <p className="font-avenir-heavy mt-auto pt-2 text-base text-[#78bfd0] sm:text-lg">
                                  NPS of {client.caseStudy.nps}%
                                </p>
                              </div>

                              {/* Partner logo */}
                              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl p-1 sm:h-28 sm:w-28 sm:p-2">
                                <ImageAction
                                  alt={client.logo.alt || `${client.name} logo`}
                                  src={client.logo.url}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Lower section */}
                          <div className="relative min-h-0 flex-1 bg-[#A7CDD1]/10">
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.025] via-transparent to-black/20" />

                            <div className="relative z-10 h-full space-y-5 overflow-y-auto p-4 sm:space-y-6 sm:p-6">
                              {/* Challenges */}
                              <div className="min-w-0 text-sm leading-relaxed text-gray-100 sm:text-base">
                                <p className="font-avenir-black mb-2 text-[#83bd62]">
                                  What challenges does {client.name} face?
                                </p>
                                <p>{client.caseStudy.challenge}</p>
                              </div>

                              {/* Solution */}
                              <div className="min-w-0 text-sm leading-relaxed text-gray-100 sm:text-base">
                                <p className="font-avenir-black mb-2 text-[#83bd62]">
                                  What solution do we offer?
                                </p>
                                <p>{client.caseStudy.solution}</p>
                              </div>

                              {/* Impact */}
                              <div className="min-w-0 text-sm leading-relaxed text-gray-100 sm:text-base">
                                <p className="font-avenir-black mb-2 text-[#83bd62]">
                                  Impact that we deliver
                                </p>
                                <p>{client.caseStudy.impact}</p>
                              </div>
                            </div>
                          </div>

                          {/* Slide indicator */}
                          <div className="pointer-events-none absolute right-4 bottom-2 z-20">
                            <span className="font-lato-light-italic text-xs text-gray-300/70">
                              {idx + 1} / {safeRecentPartners.length}
                            </span>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* Navigation */}
                  <CarouselPrevious className="left-1 z-20 h-9 w-9 rounded-[10px] border border-white/70 bg-[#83bd62]/90 text-white hover:bg-[#83bd62] sm:left-3" />
                  <CarouselNext className="right-1 z-20 h-9 w-9 rounded-[10px] border border-white/70 bg-[#83bd62]/90 text-white hover:bg-[#83bd62] sm:right-3" />
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
              <span className="bg-gradient-to-r from-[#6FAA26] to-[#58B9D1] bg-clip-text text-transparent">
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
