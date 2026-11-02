"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import ImageAction from "@/components/elements/ImageAction";
import Container from "@/components/layout/Container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { Partner, PartnerCategory, RecentPartner } from "@/lib/partners/types";

type PreviousClientsProps = {
  partners?: Partner[];
  recentPartners?: RecentPartner[];
};

type PartnerFilter = "all" | PartnerCategory;

const filters: { label: string; value: PartnerFilter }[] = [
  { label: "All", value: "all" },
  { label: "Clients", value: "client" },
  { label: "Case Collaboration", value: "case-collaboration" },
  { label: "Event Collaboration", value: "event-collaboration" },
  { label: "Media Partner", value: "media-partner" },
];

// These organizations appear in more than one of the supplied Figma frames.
// Payload retains its existing single-category field.
const additionalCategories: Record<string, PartnerCategory[]> = {
  "Gadjah Mada Business Case Competition": ["event-collaboration"],
  ParagonCorp: ["event-collaboration"],
  "SRE UGM": ["media-partner"],
};

// Snapshot of the supplied client records and Figma partner catalogue. These are
// intentionally editorial constants, rather than additional Payload models.
const metrics = [
  {
    number: "83",
    label: "Clients & Partners",
    image: "/img/portofolio/statistics/partners_statistics.jpg",
  },
  {
    // The supplied tracker verifies 35 completed projects, not the full historical
    // events/partnership total. Retained at the owner's request pending that data.
    number: "450",
    label: "Projects Completed",
    image: "/img/portofolio/statistics/projects_statistics.jpg",
  },
  {
    // Feedback workbook: 21 Satisfied/Very Satisfied out of 23 filled responses.
    number: "91.3%",
    label: "Customer Satisfaction",
    image: "/img/portofolio/statistics/impactful_statistics.jpg",
  },
  {
    number: "5+",
    label: "Years Active",
    image: "/img/portofolio/statistics/years_statistics.png",
  },
];

const gradientText = "bg-gradient-to-r from-[#6FAA26] to-[#58B9D1] bg-clip-text text-transparent";
const architecturalBackground = "/img/portofolio/hero_bg-new.jpg";

function PartnerPopup({ partner, onClose }: { partner: Partner | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!partner || !dialog) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [partner]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = event.currentTarget.querySelectorAll<HTMLElement>(
          "button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"
        );
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
      className="fixed inset-0 m-auto max-h-[72.25svh] w-[calc(85%-1.7rem)] max-w-[722.5px] overflow-y-auto rounded-[25.5px] border border-[#77BA47] bg-[#202020] p-0 text-white shadow-[0_0_20.4px_#77ba4726] backdrop:bg-black/65 backdrop:backdrop-blur-sm"
    >
      {partner ? (
        <div className="relative isolate min-h-[306px] overflow-hidden p-[20.4px] sm:min-h-[399.5px] sm:p-[34px]">
          {partner.popup?.background ? (
            <Image
              src={partner.popup.background.url}
              alt=""
              fill
              unoptimized
              className="pointer-events-none -z-20 object-cover"
            />
          ) : null}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/65 to-black/35" />
          <button
            type="button"
            aria-label="Close company details"
            onClick={onClose}
            className="absolute top-[13.6px] right-[13.6px] flex h-[30.6px] w-[30.6px] items-center justify-center rounded-[6.8px] bg-[#77BA47] text-[13.6px] text-white transition hover:bg-[#639f38] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <FaTimes aria-hidden="true" />
          </button>
          <h2
            id={titleId}
            className="font-avenir-black pr-[27.2px] text-[27.2px] leading-tight break-words text-[#83bd61] sm:text-[40.8px]"
          >
            {partner.name}
          </h2>
          <div className="mt-[20.4px] grid items-center gap-[20.4px] sm:grid-cols-[minmax(0,1fr)_204px] sm:gap-[27.2px]">
            {partner.description ? (
              <p className="font-avenir-heavy text-[15.3px] leading-relaxed whitespace-pre-line text-white sm:text-[20.4px]">
                {partner.description}
              </p>
            ) : (
              <p className="text-[11.9px] text-white/80">Learn more about {partner.name}.</p>
            )}
            {partner.logo ? (
              <Image
                src={partner.logo.url}
                alt={partner.logo.alt || `${partner.name} logo`}
                width={320}
                height={320}
                unoptimized
                className="mx-auto h-[136px] w-[149.6px] object-contain sm:h-[204px] sm:w-[204px]"
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

function CaseStudyCard({ partner }: { partner: RecentPartner }) {
  // The desktop card markup, sizing and transparent text columns are from main.
  return (
    <div className="w-full">
      <div className="relative h-96 w-full lg:h-[500px] xl:h-[600px] 2xl:h-[700px]">
        <div className="absolute h-1/2 w-full rounded-lg rounded-bl-none lg:rounded-xl 2xl:rounded-2xl">
          <div className="relative h-full w-full bg-[#0A1E22]/47" />
        </div>
        <div className="relative mt-4 flex h-1/2 w-full gap-4 p-4 lg:mt-6 lg:gap-8 lg:p-6 xl:gap-12 2xl:p-8">
          <div className="relative flex h-full w-7/12 flex-col items-start justify-start gap-2 lg:gap-4">
            <p className="font-avenir-black text-lg leading-none text-green-300 lg:text-2xl 2xl:text-3xl">
              {partner.name}
            </p>
            <div className="font-avenir-light text-sm leading-none text-cyan-300 lg:text-base 2xl:text-lg">
              <h2 className="font-avenir-black text-gray-100">{partner.description}</h2>
              <p>
                <strong className="font-avenir-heavy absolute bottom-0 text-base lg:text-xl 2xl:text-2xl">
                  NPS of {partner.caseStudy.nps}%
                </strong>
              </p>
            </div>
          </div>
          <div className="flex h-full w-5/12 items-center justify-center">
            <div className="flex w-4/5 overflow-clip rounded-lg lg:rounded-xl 2xl:rounded-2xl">
              <ImageAction
                alt={partner.logo.alt || `${partner.name} logo`}
                src={partner.logo.url}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex h-full w-full gap-4 px-4 pb-32 lg:mt-6 lg:gap-6 lg:px-6 lg:pb-40 2xl:gap-8 2xl:px-8 2xl:pb-48">
          <div className="font-lato-regular w-4/12 text-justify text-xs leading-relaxed text-gray-100 lg:text-sm 2xl:text-base">
            <p className="font-avenir-black mb-2 text-green-300 lg:mb-3">
              What challenges does {partner.name} face?
            </p>
            <p>{partner.caseStudy.challenge}</p>
          </div>
          <div className="font-lato-regular w-4/12 text-justify text-xs leading-relaxed text-gray-100 lg:text-sm 2xl:text-base">
            <p className="font-avenir-black mb-2 text-green-300 lg:mb-3">
              What solution does we offer?
            </p>
            <p>{partner.caseStudy.solution}</p>
          </div>
          <div className="font-lato-regular w-4/12 text-justify text-xs leading-relaxed text-gray-100 lg:text-sm 2xl:text-base">
            <p className="font-avenir-black mb-2 text-green-300 lg:mb-3">
              Impact & Client Feedback
            </p>
            <p>{partner.caseStudy.impact}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreviousClients({
  partners = [],
  recentPartners = [],
}: PreviousClientsProps) {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [activeFilter, setActiveFilter] = useState<PartnerFilter>("all");
  const [desktopApi, setDesktopApi] = useState<CarouselApi>();
  const [mobileApi, setMobileApi] = useState<CarouselApi>();
  const [partnerApi, setPartnerApi] = useState<CarouselApi>();
  const [partnerPage, setPartnerPage] = useState(0);
  const [partnerColumns, setPartnerColumns] = useState(5);
  const recentSectionRef = useRef<HTMLDivElement>(null);
  const desktopAutoplay = useMemo(
    () =>
      Autoplay({ delay: 5000, playOnInit: false, stopOnInteraction: true, stopOnMouseEnter: true }),
    []
  );
  const mobileAutoplay = useMemo(
    () =>
      Autoplay({ delay: 5000, playOnInit: false, stopOnInteraction: true, stopOnMouseEnter: true }),
    []
  );

  useEffect(() => {
    if (
      (!desktopApi && !mobileApi) ||
      !recentSectionRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.intersectionRect.height >= Math.min(400, window.innerHeight / 2);
        const desktop = window.matchMedia("(min-width: 1024px)").matches;
        if (desktopApi && inView && desktop) desktopAutoplay.play();
        else desktopAutoplay.stop();
        if (mobileApi && inView && !desktop) mobileAutoplay.play();
        else mobileAutoplay.stop();
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    observer.observe(recentSectionRef.current);
    return () => {
      observer.disconnect();
      desktopAutoplay.stop();
      mobileAutoplay.stop();
    };
  }, [desktopAutoplay, mobileAutoplay, desktopApi, mobileApi]);
  useEffect(() => {
    const queries = [
      window.matchMedia("(min-width: 1024px)"),
      window.matchMedia("(min-width: 768px)"),
      window.matchMedia("(min-width: 640px)"),
    ];
    const updateColumns = () => {
      setPartnerColumns(
        queries[0].matches ? 5 : queries[1].matches ? 4 : queries[2].matches ? 3 : 2
      );
      setPartnerPage(0);
    };
    updateColumns();
    queries.forEach((query) => query.addEventListener("change", updateColumns));
    return () => queries.forEach((query) => query.removeEventListener("change", updateColumns));
  }, []);

  useEffect(() => {
    if (!partnerApi) return;
    const updatePage = () => setPartnerPage(partnerApi.selectedScrollSnap());
    updatePage();
    partnerApi.on("select", updatePage);
    partnerApi.on("reInit", updatePage);
    return () => {
      partnerApi.off("select", updatePage);
      partnerApi.off("reInit", updatePage);
    };
  }, [partnerApi]);

  const visiblePartners = useMemo(
    () =>
      partners
        .filter(
          (partner) =>
            activeFilter === "all" ||
            partner.category === activeFilter ||
            additionalCategories[partner.name]?.includes(activeFilter)
        )
        .sort((a, b) => {
          const aLast = /^360\s*energy$/i.test(a.name.trim());
          const bLast = /^360\s*energy$/i.test(b.name.trim());
          return (
            Number(aLast) - Number(bLast) ||
            a.name.localeCompare(b.name, "en", { sensitivity: "base", numeric: true })
          );
        }),
    [partners, activeFilter]
  );
  const partnerPages = useMemo(() => {
    const perPage = partnerColumns * 3;
    return Array.from({ length: Math.ceil(visiblePartners.length / perPage) }, (_, page) =>
      visiblePartners.slice(page * perPage, (page + 1) * perPage)
    );
  }, [visiblePartners, partnerColumns]);
  const carouselTarget = recentPartners.length ? "recent-partners" : "our-partners";

  return (
    <div className="relative text-white">
      <div className="bg-black-300 relative flex min-h-screen flex-col overflow-hidden lg:min-h-[max(100svh,48rem)]">
        {/* Preserve preview's centered backdrop frame: its 680px hero, padded
            viewport-height title (80px), and original 288px grid section.
            The populated CMS grid must not change this crop. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-1 [background-size:100%_auto] bg-top bg-no-repeat lg:bottom-auto lg:h-[calc(100svh+680px+80px+288px)] lg:bg-cover lg:bg-center"
          style={{
            backgroundImage: `url('${architecturalBackground}')`,
          }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-1 bg-black/60" />
        {/* Main's opening fade: the building gives way to the original dark grey. */}
        <div
          aria-hidden="true"
          className="to-black-300 pointer-events-none absolute inset-0 z-2 bg-gradient-to-b from-transparent from-70% to-90%"
        />

        {/* Hero and metric dimensions copied from preview. */}
        <Container className="relative z-10">
          <section className="flex min-h-[520px] flex-col items-center justify-center px-5 py-16 text-center sm:min-h-[600px] sm:px-8">
            <h1 className="font-avenir-black max-w-3xl text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
              Partnerships that
              <br />
              Drive <span className={gradientText}>Impact</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
              We collaborate with organizations across diverse sectors to deliver strategic,
              data-driven solutions that create meaningful and measurable impact.
            </p>
            <div className="mt-9 grid w-full max-w-[620px] grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {metrics.map((item) => (
                <div
                  key={item.label}
                  className="group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/50 bg-black/10 px-2 shadow-[5px_7px_3px_#58B9D140] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#83bd8b]/80"
                  style={{
                    backgroundImage: `linear-gradient(rgba(10, 15, 18, 0.58), rgba(10, 15, 18, 0.68)), url('${item.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <span className="font-avenir-black bg-gradient-to-b from-[#6FAA26] to-[#58B9D1] bg-clip-text text-2xl text-transparent sm:text-3xl lg:text-[40px]">
                    {item.number}
                  </span>
                  <span className="mt-2 flex min-h-8 items-center justify-center text-center text-[10px] text-gray-200 sm:text-xs">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </Container>

        {/* Main's title/cue, placed at the foot of the opening viewport. */}
        <div className="relative z-3 -mt-4 flex w-full flex-1 flex-col items-center justify-end pb-8 max-lg:gap-8 max-lg:px-8 lg:absolute lg:inset-x-0 lg:bottom-[8svh] lg:mt-0 lg:pb-0">
          <h1 className="font-avenir-black z-3 text-center text-[32px] leading-tight text-gray-100 sm:text-[44px] md:text-[54px] lg:text-[64px]">
            Our Previous Clients
          </h1>
          <button
            type="button"
            onClick={() =>
              document.getElementById(carouselTarget)?.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
              })
            }
            aria-label="Scroll down to previous clients carousel"
            className="z-3 flex flex-col items-center outline-0 focus-visible:ring-2 focus-visible:ring-green-300"
          >
            <span className="font-lato-bold mt-4 text-sm text-gray-100 max-lg:hidden sm:text-base md:text-lg">
              SCROLL DOWN
            </span>
            <FaChevronDown
              aria-hidden="true"
              className="animate-moving-pointer text-lg text-gray-100 motion-reduce:animate-none sm:text-2xl md:text-3xl"
            />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Preview's building scale, with main's grey-to-building gradient stops. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-1"
          style={{
            backgroundImage: `url('${architecturalBackground}')`,
            backgroundSize: "100% auto",
            backgroundRepeat: "repeat-y",
            backgroundPosition: "center top",
          }}
        />
        <div
          aria-hidden="true"
          className="bg-black-300 pointer-events-none absolute inset-0 z-1 opacity-85"
        />
        <div
          aria-hidden="true"
          className="from-black-300 pointer-events-none absolute inset-x-0 top-0 z-1 h-screen bg-gradient-to-b from-20% to-transparent to-45%"
        />
        <div
          aria-hidden="true"
          className="to-black-300 pointer-events-none absolute inset-x-0 bottom-0 z-1 h-screen bg-gradient-to-b from-transparent from-45% to-90%"
        />

        {recentPartners.length ? (
          <div id="recent-partners" ref={recentSectionRef} className="relative scroll-mt-4">
            <Container color="dark" className="relative z-2">
              <div className="mb-6 w-full px-6 pt-8 lg:px-0">
                <h2 className="font-avenir-black text-2xl sm:text-3xl">
                  Recent <span className={gradientText}>Partners</span>
                </h2>
              </div>
              {/* Desktop carousel copied from main. */}
              <div className="relative hidden w-full flex-col items-center justify-center px-6 lg:flex">
                <div className="h-full w-full 2xl:w-[1536px]">
                  <div className="relative flex h-[85%] w-full items-end justify-center pb-12 lg:pb-16 2xl:pb-20">
                    <Carousel
                      opts={{ align: "start", loop: true, slidesToScroll: 1 }}
                      plugins={[desktopAutoplay]}
                      setApi={setDesktopApi}
                      className="w-full"
                    >
                      <CarouselContent className="-ml-4">
                        {recentPartners.map((partner) => (
                          <CarouselItem key={partner.id} className="basis-1/2 pl-4">
                            <CaseStudyCard partner={partner} />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious
                        variant="ghost"
                        className="left-4 z-10 hidden rounded-[10px] border-0 bg-green-300/80 shadow-none hover:bg-green-300 lg:flex"
                      />
                      <CarouselNext
                        variant="ghost"
                        className="right-4 z-10 hidden rounded-[10px] border-0 bg-green-300/80 shadow-none hover:bg-green-300 lg:flex"
                      />
                    </Carousel>
                  </div>
                </div>
              </div>

              {/* Mobile carousel copied from main, with Payload fields substituted. */}
              <div className="z-4 h-fit w-full lg:hidden">
                <Carousel
                  opts={{ align: "start", loop: true }}
                  plugins={[mobileAutoplay]}
                  setApi={setMobileApi}
                >
                  <CarouselContent>
                    {recentPartners.map((partner) => (
                      <CarouselItem key={partner.id} className="basis-full">
                        <div className="relative h-96 overflow-clip rounded-[14px] sm:min-h-screen md:h-full">
                          <div className="absolute -z-990 h-full w-full">
                            <div className="relative h-full w-full bg-[#2C6970]/47" />
                          </div>
                          <div className="flex h-full w-full items-center justify-center px-2 py-4 sm:px-4">
                            <button
                              type="button"
                              aria-label="Previous client"
                              className="mr-2 w-fit sm:mr-4"
                              onClick={() => mobileApi?.scrollPrev()}
                            >
                              <FaChevronLeft className="text-4xl text-gray-100/35 sm:text-5xl md:text-6xl" />
                            </button>
                            <div className="flex h-full w-full flex-col items-center justify-center gap-8 overflow-clip sm:gap-12">
                              <div className="relative mt-4 flex h-1/3 w-full gap-4 sm:mt-6 sm:gap-6">
                                <div className="flex h-full w-1/3 items-center justify-end sm:w-2/5">
                                  <div className="flex w-full overflow-clip rounded-2xl sm:rounded-3xl">
                                    <ImageAction
                                      alt={partner.logo.alt || `${partner.name} logo`}
                                      src={partner.logo.url}
                                    />
                                  </div>
                                </div>
                                <div className="flex h-full flex-col items-start justify-center gap-2 sm:gap-3">
                                  <p className="font-avenir-black text-2xl leading-none text-green-300 sm:text-3xl md:text-4xl">
                                    {partner.name}
                                  </p>
                                </div>
                              </div>
                              <div className="flex h-3/5 w-full flex-col gap-4 overflow-y-scroll px-4 sm:gap-6 sm:px-6">
                                <div className="font-lato-regular text-justify text-sm leading-relaxed text-gray-100 sm:text-base md:text-lg">
                                  <p className="font-avenir-black mb-2 text-green-300">
                                    What challenges does {partner.name} face?
                                  </p>
                                  <p>{partner.caseStudy.challenge}</p>
                                </div>
                                <div className="font-lato-regular text-sm leading-relaxed text-gray-100 sm:text-base md:text-lg">
                                  <p className="font-avenir-black mb-2 text-green-300">
                                    What solution does we offer?
                                  </p>
                                  <p>{partner.caseStudy.solution}</p>
                                </div>
                                <div className="font-lato-regular text-sm leading-relaxed text-gray-100 sm:text-base md:text-lg">
                                  <p className="font-avenir-black mb-2 text-green-300">
                                    Impact & Client Feedback
                                  </p>
                                  <p>{partner.caseStudy.impact}</p>
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
                              className="ml-2 w-fit sm:ml-4"
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

        {/* Preview's partner cards, paginated into a looping three-row carousel. */}
        <section
          id="our-partners"
          aria-labelledby="our-partners-title"
          className="relative z-2 scroll-mt-28 px-5 pt-8 pb-16 sm:px-8 lg:px-12 lg:pb-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 id="our-partners-title" className="font-avenir-black text-2xl sm:text-3xl">
                Our <span className={gradientText}>Partners</span>
              </h2>
              <div
                aria-label="Filter clients and partners"
                className="flex flex-wrap items-center gap-1 rounded-full bg-[#171717]/90 p-1"
              >
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => {
                      setActiveFilter(filter.value);
                      setPartnerPage(0);
                      partnerApi?.scrollTo(0, true);
                    }}
                    aria-pressed={activeFilter === filter.value}
                    className={`rounded-full px-3 py-2.5 text-sm whitespace-nowrap transition-colors duration-200 ${activeFilter === filter.value ? "bg-[#83bd61] text-white" : "text-gray-200 hover:bg-white/10 hover:text-white"}`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            {visiblePartners.length ? (
              <div>
                <div className="px-7 sm:px-8 lg:px-0">
                  <Carousel
                    key={`${activeFilter}-${partnerColumns}`}
                    opts={{ align: "start", loop: partnerPages.length > 1, slidesToScroll: 1 }}
                    setApi={setPartnerApi}
                    aria-label="Clients and partners catalogue"
                    className="w-full"
                  >
                    <CarouselContent className="ml-0">
                      {partnerPages.map((page, pageIndex) => (
                        <CarouselItem
                          key={pageIndex}
                          className="basis-full pl-0"
                          aria-label={`Partner page ${pageIndex + 1} of ${partnerPages.length}`}
                        >
                          <div className="grid h-full grid-cols-2 grid-rows-[repeat(3,minmax(148px,1fr))] gap-1.5 sm:grid-cols-3 sm:grid-rows-[repeat(3,minmax(154px,1fr))] sm:gap-2 md:grid-cols-4 lg:aspect-[2/1] lg:grid-cols-5 lg:grid-rows-3">
                            {page.map((partner) => (
                              <button
                                key={partner.id}
                                type="button"
                                onClick={() => setSelectedPartner(partner)}
                                aria-label={`View details for ${partner.name}`}
                                aria-haspopup="dialog"
                                aria-expanded={selectedPartner?.id === partner.id}
                                data-selected={selectedPartner?.id === partner.id}
                                className="group flex aspect-[1.2/1] h-full w-full flex-col items-center justify-center rounded-[22px] border border-[#6e6e6e] bg-[#202020] px-3 py-4 text-center transition-all duration-200 hover:border-[#83bd61] hover:bg-[#242824] hover:shadow-[0_4px_12px_rgba(131,189,97,0.12)] focus-visible:ring-2 focus-visible:ring-[#83bd61] focus-visible:outline-none data-[selected=true]:border-[#83bd61] data-[selected=true]:bg-[#242824] data-[selected=true]:shadow-[0_4px_12px_rgba(131,189,97,0.12)]"
                              >
                                {partner.logo ? (
                                  <div className="mb-3 flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-[15px] border border-[#6e6e6e] bg-[#252525] transition-colors group-hover:border-[#83bd61] group-hover:shadow-[0_2px_5px_rgba(131,189,97,0.15)] group-data-[selected=true]:border-[#83bd61] group-data-[selected=true]:shadow-[0_2px_5px_rgba(131,189,97,0.15)]">
                                    <Image
                                      src={partner.logo.url}
                                      alt={partner.logo.alt || `${partner.name} logo`}
                                      width={320}
                                      height={320}
                                      unoptimized
                                      className="h-full w-full object-contain p-2"
                                    />
                                  </div>
                                ) : null}
                                <span className="line-clamp-2 text-xs leading-snug font-medium text-white sm:text-sm">
                                  {partner.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious
                      variant="ghost"
                      aria-label="Previous partner page"
                      className="-left-8 z-10 h-7 w-7 rounded-[6px] border-0 bg-green-300/80 shadow-none hover:bg-green-300 lg:-left-10 lg:h-8 lg:w-8"
                    />
                    <CarouselNext
                      variant="ghost"
                      aria-label="Next partner page"
                      className="-right-8 z-10 h-7 w-7 rounded-[6px] border-0 bg-green-300/80 shadow-none hover:bg-green-300 lg:-right-10 lg:h-8 lg:w-8"
                    />
                  </Carousel>
                </div>
                {partnerPages.length > 1 ? (
                  <nav
                    aria-label="Partner pages"
                    className="mt-6 flex flex-wrap items-center justify-center gap-2"
                  >
                    <button
                      type="button"
                      aria-label="Previous page"
                      onClick={() => partnerApi?.scrollPrev()}
                      className="flex h-6 w-6 items-center justify-center rounded text-xs text-white/80 hover:text-green-300 focus-visible:outline-2 focus-visible:outline-green-300"
                    >
                      <FaChevronLeft aria-hidden="true" />
                    </button>
                    {partnerPages.map((_, pageIndex) => (
                      <button
                        key={pageIndex}
                        type="button"
                        aria-label={`Go to partner page ${pageIndex + 1}`}
                        aria-current={partnerPage === pageIndex ? "page" : undefined}
                        onClick={() => partnerApi?.scrollTo(pageIndex)}
                        className={`h-2 w-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-300 ${partnerPage === pageIndex ? "bg-green-300" : "bg-white/80 hover:bg-white"}`}
                      />
                    ))}
                    <button
                      type="button"
                      aria-label="Next page"
                      onClick={() => partnerApi?.scrollNext()}
                      className="flex h-6 w-6 items-center justify-center rounded text-xs text-white/80 hover:text-green-300 focus-visible:outline-2 focus-visible:outline-green-300"
                    >
                      <FaChevronRight aria-hidden="true" />
                    </button>
                    <span className="sr-only" aria-live="polite">
                      Page {partnerPage + 1} of {partnerPages.length}
                    </span>
                  </nav>
                ) : null}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-gray-400">
                No partners available in this category.
              </p>
            )}
          </div>
        </section>
      </div>
      <PartnerPopup partner={selectedPartner} onClose={() => setSelectedPartner(null)} />
    </div>
  );
}
