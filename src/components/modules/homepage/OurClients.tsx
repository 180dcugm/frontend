"use client";

import Image from "@/components/elements/ReliableImage";
import { getMediaImage } from "@/lib/media-images";
import Link from "next/link";
import { useState } from "react";
import Container from "@/components/layout/Container";
import type { Telescope } from "@/payload-types";
import { industrialReports } from "@/components/modules/industrialreports/data";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import Button180 from "@/components/elements/Button180";

type OurClientsProps = {
  cards: Telescope[];
};

type ReportCard = {
  id: string;
  href: string;
  image: string;
  title: string;
  subtitle?: string;
};

type TelescopeCard = {
  id: string;
  href: string;
  image: string;
  originalSrc?: string;
  title: string;
  subtitle?: string;
};

export function OurClients({ cards }: OurClientsProps) {
  const [reportIndex, setReportIndex] = useState(0);
  const [telescopeIndex, setTelescopeIndex] = useState(0);

  const reportCards: ReportCard[] = industrialReports.map((report) => ({
    id: `report-${report.id}`,
    href: `/article/industrialreport/${report.slug}`,
    image: report.coverImage,
    title: report.title,
    subtitle: report.subtitle,
  }));

  const telescopeCards: TelescopeCard[] = cards.reduce<TelescopeCard[]>((acc, card) => {
    const image = getMediaImage(card.image, "popup");
    if (!image) return acc;

    acc.push({
      id: `telescope-${card.id}`,
      href: `/article/telescope/${card.slug}`,
      image: image.src,
      originalSrc: image.originalSrc,
      title: card.title,
      subtitle: card.author ? `by ${card.author}` : undefined,
    });

    return acc;
  }, []);

  const hasReports = reportCards.length > 0;
  const hasTelescope = telescopeCards.length > 0;

  const currentReport = hasReports
    ? reportCards[((reportIndex % reportCards.length) + reportCards.length) % reportCards.length]
    : null;

  const currentTelescope = hasTelescope
    ? telescopeCards[
        ((telescopeIndex % telescopeCards.length) + telescopeCards.length) % telescopeCards.length
      ]
    : null;

  const goReportPrev = () => {
    if (!hasReports) return;
    setReportIndex((prev) => (prev - 1 + reportCards.length) % reportCards.length);
  };

  const goReportNext = () => {
    if (!hasReports) return;
    setReportIndex((prev) => (prev + 1) % reportCards.length);
  };

  const goTelescopePrev = () => {
    if (!hasTelescope) return;
    setTelescopeIndex((prev) => (prev - 1 + telescopeCards.length) % telescopeCards.length);
  };

  const goTelescopeNext = () => {
    if (!hasTelescope) return;
    setTelescopeIndex((prev) => (prev + 1) % telescopeCards.length);
  };

  return (
    <section className="relative overflow-hidden bg-[#2f3135] py-14 lg:py-16">
      <Image
        src="/img/homepage/homeStar.webp"
        alt="ornament"
        width={64}
        height={64}
        className="pointer-events-none absolute top-[112px] left-[5%] z-10 hidden lg:block"
      />
      <Image
        src="/img/bootcamp/cincin.webp"
        alt="ornament"
        width={150}
        height={150}
        className="pointer-events-none absolute -right-2 bottom-0 z-10 hidden lg:block"
      />

      <Container>
        <div className="relative z-20 mx-auto w-full max-w-[1320px]">
          <h2
            className="font-avenir-black mx-auto max-w-[980px] text-center text-3xl leading-tight text-white sm:text-4xl lg:text-[60px] lg:leading-[1.1]"
            data-aos="fade-up"
          >
            Industry Reports and Articles
          </h2>

          <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[0.72fr_1.6fr] lg:items-end lg:gap-10">
            <div
              className="relative flex flex-col items-center"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              {currentReport ? (
                <>
                  <div className="mx-auto flex w-full max-w-[360px] items-center gap-4 sm:max-w-[404px] lg:max-w-[310px]">
                    <div className="relative min-w-0 flex-1">
                      <Link
                        href={currentReport.href}
                        className="group relative mx-auto block aspect-[310/480] w-full overflow-hidden rounded-[10px] bg-[#868286]"
                      >
                        <Image
                          src={currentReport.image}
                          alt={currentReport.title}
                          fill
                          sizes="(max-width: 1023px) 310px, 260px"
                          className="object-cover opacity-70 transition-transform duration-300 group-hover:scale-105"
                        />

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pt-16 pb-5 sm:px-6 sm:pb-6">
                          <h3 className="font-avenir-black line-clamp-3 text-[20px] leading-tight text-white sm:text-[26px] lg:text-[42px] lg:leading-[1.05]">
                            {currentReport.title}
                          </h3>
                          {currentReport.subtitle && (
                            <p className="font-lato-regular mt-2 text-sm text-white/90 sm:text-base lg:text-[13px] lg:leading-snug">
                              {currentReport.subtitle}
                            </p>
                          )}
                        </div>
                      </Link>

                      <button
                        type="button"
                        aria-label="Next industrial report"
                        onClick={goReportNext}
                        className="absolute top-1/2 right-3 hidden h-[88px] w-[88px] -translate-y-1/2 items-center justify-center rounded-full bg-[#78BE43] text-black shadow-[0_12px_24px_rgba(0,0,0,0.28)] lg:flex"
                      >
                        <ChevronRight size={52} strokeWidth={3} />
                      </button>
                    </div>

                    <button
                      type="button"
                      aria-label="Next industrial report"
                      onClick={goReportNext}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#78BE43] text-black shadow-[0_8px_18px_rgba(0,0,0,0.3)] lg:hidden"
                    >
                      <ChevronRight size={30} strokeWidth={3} />
                    </button>
                  </div>

                  <Button180
                    text="See all Industrial Reports"
                    icon={<ArrowUpRight />}
                    href="/article/industrialreport"
                    color="green"
                    size="md"
                    addClass="w-full lg:max-w-[320px] mt-4 mx-auto justify-center"
                  />
                </>
              ) : (
                <div className="rounded-[10px] bg-black/20 p-6 text-white">
                  No industrial reports yet.
                </div>
              )}
            </div>

            <div className="relative" data-aos="fade-left" data-aos-delay="400">
              {currentTelescope ? (
                <>
                  <div className="flex w-full items-center gap-4 lg:block">
                    <div className="relative min-w-0 flex-1">
                      <Link
                        href={currentTelescope.href}
                        className="group relative block h-[260px] overflow-hidden rounded-[10px] bg-[#868286] sm:h-[340px] lg:h-[480px]"
                      >
                        <Image
                          src={currentTelescope.image}
                          originalSrc={currentTelescope.originalSrc}
                          alt={currentTelescope.title}
                          fill
                          sizes="(max-width: 1023px) 85vw, 850px"
                          className="object-cover opacity-70 transition-transform duration-300 group-hover:scale-105"
                        />

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pt-16 pb-5 sm:px-6 sm:pb-6">
                          <h3 className="font-avenir-black line-clamp-3 text-[20px] leading-tight text-white sm:text-[28px] lg:text-[42px] lg:leading-[1.08]">
                            {currentTelescope.title}
                          </h3>
                          {currentTelescope.subtitle && (
                            <p className="font-lato-regular mt-2 text-sm text-white/90 sm:text-base lg:text-2xl">
                              {currentTelescope.subtitle}
                            </p>
                          )}
                        </div>
                      </Link>

                      <button
                        type="button"
                        aria-label="Next telescope article"
                        onClick={goTelescopeNext}
                        className="absolute top-1/2 right-3 hidden h-[88px] w-[88px] -translate-y-1/2 items-center justify-center rounded-full bg-[#78BE43] text-black shadow-[0_12px_24px_rgba(0,0,0,0.28)] lg:flex"
                      >
                        <ChevronRight size={52} strokeWidth={3} />
                      </button>
                    </div>

                    <button
                      type="button"
                      aria-label="Next telescope article"
                      onClick={goTelescopeNext}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#78BE43] text-black shadow-[0_8px_18px_rgba(0,0,0,0.3)] lg:hidden"
                    >
                      <ChevronRight size={30} strokeWidth={3} />
                    </button>
                  </div>

                  <Button180
                    text="See all Telescope Articles"
                    icon={<ArrowUpRight />}
                    href="/article/telescope"
                    color="green"
                    size="md"
                    addClass="w-full justify-center mt-4"
                  />
                </>
              ) : (
                <div className="rounded-[10px] bg-black/20 p-6 text-white">
                  No telescope articles yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
