"use client";

import Image from "@/components/elements/ReliableImage";
import { getMediaImage } from "@/lib/media-images";
import Link from "next/link";
import Button180 from "@/components/elements/Button180";
import Container from "@/components/layout/Container";
import type { Hero as HeroType } from "@/payload-types";
import { NavbarResolver } from "@/components/elements/Navbar/NavbarResolver";
import { ArrowUpRight, Phone } from "lucide-react";
import ContactUsButton180 from "@/components/elements/ContactUsButton180";

// Previous clients shown in the homepage marquee, in display order. Each logo
// was trimmed of its margins and padded onto an identical 400x140 canvas, so
// they all render at the same height instead of at whatever size their source
// file happened to be.
const previousClients = [
  {
    name: "National Geographic Society",
    logo: "/img/homepage/marquee/national-geographic-society.webp",
  },
  { name: "The Nature Conservancy", logo: "/img/homepage/marquee/the-nature-conservancy.webp" },
  { name: "Kitabisa", logo: "/img/homepage/marquee/kitabisa.webp" },
  { name: "Gili Eco Trust", logo: "/img/homepage/marquee/gili-eco-trust.webp" },
  { name: "Tersalur", logo: "/img/homepage/marquee/tersalur.webp" },
  { name: "Planet Protector", logo: "/img/homepage/marquee/planet-protector.webp" },
  { name: "Extern", logo: "/img/homepage/marquee/extern.webp" },
  { name: "Berbagi Beras", logo: "/img/homepage/marquee/berbagi-beras.webp" },
  { name: "Foras Palestine", logo: "/img/homepage/marquee/foras-palestine.webp" },
  { name: "FlashCampus", logo: "/img/homepage/marquee/flashcampus.webp" },
];

export function Hero({ heroData }: { heroData: Partial<HeroType> }) {
  const newsTitle = heroData?.newsTitle || "180DC UGM Consulting Bootcamp";
  const newsContent =
    heroData?.newsContent ||
    "The 180DC UGM Consulting Bootcamp 2025 is an online program designed to help you learn, apply, and master the essential skills every consultant needs. Whether you're a beginner or an aspiring problem-solver, this is the perfect place to start your journey!";

  const newsLink = heroData?.newsLink || "#";
  const newsMedia = getMediaImage(heroData?.newsImage, "popup");
  const newsImage = newsMedia?.src || "/img/homepage/caseBook.webp";
  const isLandscapeNews =
    typeof heroData.newsImage === "object" &&
    heroData.newsImage !== null &&
    heroData.newsImage.width > heroData.newsImage.height;

  return (
    <>
      {/* Hero */}
      <div className="relative z-10 flex h-fit min-h-screen w-full items-center rounded-b-4xl border-b-6 border-white bg-[#313131] px-[5%] max-lg:pt-[15vh] max-lg:pb-[25vh] sm:px-[10%] lg:h-[50vw] lg:px-[4%]">
        {/* Hero Background */}
        <Image
          src="/img/homepage/hero-background.webp"
          alt="background"
          width={2000}
          height={2000}
          className="absolute inset-0 z-10 h-full w-full object-cover"
        />
        <Container className="flex flex-col">
          <NavbarResolver />
          {/* Hero Content */}
          <div className="relative z-20 flex w-full flex-col gap-8 py-5 text-white lg:min-h-[60vh] lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:pt-15">
            {/* Kolom Kiri */}
            <div className="flex w-full flex-col justify-center gap-10 max-lg:items-center">
              {/* Teks */}
              <div className="flex flex-col gap-2 max-lg:items-center" data-aos="fade-up">
                <div className="font-avenir-black text-3xl max-lg:text-center max-lg:text-green-300 sm:text-4xl lg:text-5xl lg:leading-[1.1] xl:text-[54px]">
                  Providing the{" "}
                  <span className="bg-gradient-to-b from-[#73B743] to-[#58B9D1] bg-clip-text text-transparent">
                    Perfect <br /> Solutions
                  </span>{" "}
                  For Your
                  <br />
                  Own Business.
                </div>
                <div className="font-lato-regular w-[90%] text-xs max-lg:text-center sm:text-sm lg:w-[72%] lg:text-lg xl:text-xl">
                  UGM branch of the world&apos;s largest student-led consultancy for non-profits &
                  social enterprises.
                </div>
              </div>
              {/* Tombol */}
              <div
                className="flex flex-col gap-2 max-lg:w-full max-lg:justify-center md:flex-row md:gap-8"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <Button180
                  icon={<ArrowUpRight />}
                  href="/apply"
                  size="lg"
                  color="green"
                  text="Consult Now!"
                />
                <ContactUsButton180 />
              </div>
            </div>

            {/* Kolom Kanan */}
            <div
              className="flex w-full items-center justify-center lg:w-[52%] lg:justify-end"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              <div className="relative h-[480px] w-full sm:h-[430px] lg:w-[860px]">
                <div className="relative h-full w-full">
                  {/* Green News Tab */}
                  <div className="absolute top-0 left-0 z-30 flex items-center rounded-full bg-[#73B743] px-4 py-2.5 shadow-lg sm:px-6 sm:py-3.5 lg:px-10">
                    <div className="mr-2 flex items-center gap-1.5 sm:mr-3 sm:gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#4A7D2A] sm:h-4 sm:w-4" />
                      <span className="h-3 w-3 rounded-full bg-black sm:h-4 sm:w-4" />
                      <span className="h-3 w-3 rounded-full bg-white sm:h-4 sm:w-4" />
                    </div>
                    <p className="font-avenir-heavy text-[11px] leading-none text-white sm:text-[13px] lg:text-sm">
                      180DC UGM News
                    </p>
                  </div>

                  {/* 1. Main Card Body (The large bottom rectangle) */}
                  <div className="absolute inset-0 top-[40px] z-10 overflow-hidden rounded-b-[30px] border-r border-b border-l border-white/10 bg-[#3A3A3A] shadow-2xl sm:top-[50px] sm:rounded-b-[40px]">
                    <div className="relative mx-auto grid h-full grid-cols-1 items-center justify-center gap-6 px-6 py-6 sm:grid-cols-2 sm:gap-6 sm:px-14 sm:py-4 lg:py-8">
                      {/* Left: Content */}
                      <div className="mt-6 flex flex-1 flex-col text-white max-sm:text-center sm:mt-0">
                        <div className="font-avenir-black text-[24px] leading-[1.1] text-white sm:text-[32px] lg:text-[38px]">
                          {newsTitle}
                        </div>
                        <p className="font-lato-regular mt-4 line-clamp-4 pr-0 text-[13px] leading-[1.5] text-white/85 sm:mt-6 sm:line-clamp-6 sm:pr-4 sm:text-[15px] sm:leading-[1.6]">
                          {newsContent}
                        </p>
                      </div>

                      {/* Preserve landscape publication covers as well as square news images. */}
                      <Link
                        href={newsLink}
                        className={`group/news relative mx-auto w-full overflow-hidden rounded-[16px] border border-white/5 shadow-2xl sm:mb-12 sm:max-w-full lg:rounded-[24px] ${isLandscapeNews ? "aspect-video max-w-[320px]" : "aspect-square max-w-[200px]"}`}
                      >
                        <Image
                          src={newsImage}
                          originalSrc={newsMedia?.originalSrc}
                          alt={newsTitle}
                          fill
                          sizes="(max-width: 639px) 200px, (max-width: 1023px) 35vw, 25vw"
                          className="absolute object-cover transition-transform duration-500 group-hover/news:scale-110"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* 2. Top Bar Extension (The part to the right of the tab) */}
                  <div className="absolute top-0 right-0 left-[200px] z-10 h-[41px] sm:left-[273px] sm:h-[51px] lg:left-[300px]">
                    <div className="h-full w-full rounded-tr-[30px] border-t border-r border-white/10 bg-[#3A3A3A] sm:rounded-tr-[40px]" />
                  </div>

                  {/* 3. The Concave Corner SVG (The transition) */}
                  <div className="absolute top-[0px] left-[160px] z-20 h-[40px] w-[40px] sm:top-[10px] sm:left-[233px] lg:left-[260px]">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M40 40V0C40 22.0914 22.0914 40 0 40H40Z" fill="#3A3A3A" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Marquee Section */}
          <div
            className="relative z-20 flex w-full flex-col items-center gap-6 py-4 lg:pt-6 lg:pb-6"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <p className="font-avenir-heavy text-lg text-white">Our Previous Clients</p>

            <div className="relative h-[120px] w-full overflow-hidden">
              <div className="animate-marquee absolute flex items-center gap-14 border-y border-white/5 py-6">
                {/* Double the items for a seamless loop */}
                {[...previousClients, ...previousClients].map((client, i) => (
                  <div
                    key={`${client.name}-${i}`}
                    className="relative mt-2 h-14 w-44 shrink-0 transition-transform duration-300 hover:scale-105"
                  >
                    <Image src={client.logo} alt={client.name} fill className="object-contain" />
                  </div>
                ))}
              </div>
            </div>
            <Link href="/about/services">
              <button className="group flex cursor-pointer items-center gap-2">
                <span className="font-lato-regular border-b border-transparent text-sm text-white/50 underline decoration-white/20 underline-offset-4 transition-all group-hover:border-white/30">
                  More Details &gt;
                </span>
              </button>
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
