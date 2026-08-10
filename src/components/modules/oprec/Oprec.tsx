"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import Button180 from "@/components/elements/Button180";
import { NavbarResolver } from "@/components/elements/Navbar/NavbarResolver";

interface RecruitmentBatch {
  id: string;
  title: string;
  cycle: string;
  batchYear: string;
  type: "Consulting Analyst" | "Functional Analyst";
  description: string;
  status: "Open" | "Closed";
  period: string;
  image: string;
  href: string;
}

const batches: RecruitmentBatch[] = [
  {
    id: "26-27-consulting-cycle-1",
    title: "Open Recruitment Consulting Analyst",
    cycle: "Cycle 1",
    batchYear: "26/27",
    type: "Consulting Analyst",
    description:
      "Work with real clients on impactful projects. Develop problem-solving, analytical, and communication skills while making a difference for social impact organizations.",
    status: "Closed",
    period: "August 2026",
    image: "/img/opreccycle/bgHeroOprec.png",
    href: "/events/oprec/26-27/consulting/cycle1",
  },
  {
    id: "26-27-functional-cycle-1",
    title: "Open Recruitment Functional Analyst",
    cycle: "Cycle 1",
    batchYear: "26/27",
    type: "Functional Analyst",
    description:
      "Drive internal excellence across Marketing, Human Resources, Finance, and Technology. Build leadership skills while strengthening our organization's foundation.",
    status: "Closed",
    period: "August 2026",
    image: "/img/homepage/hero1.png",
    href: "/events/oprec/26-27/functional",
  },
  {
    id: "25-26-consulting-cycle-2",
    title: "Open Recruitment Consulting Analyst",
    cycle: "Cycle 2",
    batchYear: "25/26",
    type: "Consulting Analyst",
    description:
      "Join our second cycle of consulting recruitment for Batch 25/26. Apply your skills to real-world consulting projects and create meaningful impact.",
    status: "Closed",
    period: "January 2026",
    image: "/img/opreccycle/bgHeroOprec.png",
    href: "/oprec/25-26/consulting/cycle2",
  },
  {
    id: "25-26-consulting-cycle-1",
    title: "Open Recruitment Consulting Analyst",
    cycle: "Cycle 1",
    batchYear: "25/26",
    type: "Consulting Analyst",
    description:
      "Work with real clients on impactful projects. Develop problem-solving, analytical, and communication skills while making a difference for social impact organizations.",
    status: "Closed",
    period: "August 2025",
    image: "/img/opreccycle/bgHeroOprec.png",
    href: "/events/oprec/25-26/consulting/cycle1",
  },
  {
    id: "25-26-functional-cycle-1",
    title: "Open Recruitment Functional Analyst",
    cycle: "Cycle 1",
    batchYear: "25/26",
    type: "Functional Analyst",
    description:
      "Drive internal excellence across Marketing, Human Resources, Finance, and Technology. Build leadership skills while strengthening our organization's foundation.",
    status: "Closed",
    period: "August 2025",
    image: "/img/homepage/hero1.png",
    href: "/events/oprec/25-26/functional",
  },
  {
    id: "24-25-consulting-cycle-2",
    title: "Open Recruitment Consulting Analyst",
    cycle: "Cycle 2",
    batchYear: "24/25",
    type: "Consulting Analyst",
    description:
      "Join our second cycle of consulting recruitment. Gain hands-on experience solving real business challenges for NGOs and social enterprises.",
    status: "Closed",
    period: "January 2025",
    image: "/img/opreccycle/bgHeroOprec.png",
    href: "/oprec/24-25",
  },
];

type FilterStatus = "All" | "Open" | "Closed";

// Land on the open batches when there are any, otherwise "Open" would greet
// visitors with an empty list.
const defaultFilterStatus: FilterStatus = batches.some((batch) => batch.status === "Open")
  ? "Open"
  : "All";

export default function Oprec() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(defaultFilterStatus);

  // Filter batches based on search and status, keeping open ones on top
  const filteredBatches = useMemo(() => {
    return batches
      .filter((batch) => {
        const matchesSearch =
          batch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          batch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          batch.type.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === "All" || batch.status === filterStatus;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (a.status === b.status) return 0;
        return a.status === "Open" ? -1 : 1;
      });
  }, [searchQuery, filterStatus]);

  return (
    <>
      {/* Recruitment List Section */}
      {/* flex-1 lets the black fill whatever space is left when only a couple of
          batches match, so it meets the footer instead of stopping short */}
      <section className="relative flex-1 bg-black px-[5%] py-20 sm:px-[10%] lg:px-[4%]">
        <NavbarResolver />
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="font-avenir-black mb-4 text-3xl text-white sm:text-4xl lg:text-5xl">
              Take your <span className="text-green-300">Impact</span> now!
            </h2>
            <p className="font-lato-regular mx-auto text-lg text-white/70">
              Join the latest recruitment cycle and become part of our community of changemakers.
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 sm:max-w-md">
              {/* z-10 is required: the input's backdrop-blur creates a stacking
                  context, so without it the later sibling paints over the icon */}
              <Search className="pointer-events-none absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 text-white/60" />
              <input
                type="text"
                placeholder="Search recruitment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="font-lato-regular w-full rounded-xl border border-white/20 bg-white/5 py-3 pr-4 pl-11 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-300 focus:border-green-300 focus:bg-white/10 focus:outline-none"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="font-lato-regular cursor-pointer appearance-none rounded-xl border border-white/20 bg-white/5 px-6 py-3 pr-10 text-white backdrop-blur-sm transition-all duration-300 focus:border-green-300 focus:bg-white/10 focus:outline-none"
              >
                <option value="All" className="bg-gray-900 text-white">
                  All Status
                </option>
                <option value="Open" className="bg-gray-900 text-white">
                  Open
                </option>
                <option value="Closed" className="bg-gray-900 text-white">
                  Closed
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-4 w-4 text-white/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Recruitment List */}
          <div className="mb-16 space-y-6">
            {filteredBatches.length === 0 ? (
              <div className="rounded-2xl bg-white/5 p-12 text-center backdrop-blur-xs">
                <p className="font-lato-regular text-lg text-white/60">
                  No recruitment found matching your criteria.
                </p>
              </div>
            ) : (
              filteredBatches.map((batch) => (
                <Link
                  key={batch.id}
                  href={batch.href}
                  className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xs transition-all duration-300 hover:border-green-300/30 hover:bg-white/8"
                >
                  {/* Card Background */}
                  <div className="absolute inset-0 h-full w-full">
                    <Image
                      src={batch.image}
                      alt={batch.title}
                      fill
                      className="object-cover opacity-10 transition-opacity duration-300 group-hover:opacity-20"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-transparent"></div>
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10 flex items-center justify-between gap-6 p-6 sm:p-8">
                    {/* Left Section - Main Info */}
                    <div className="min-w-0 flex-1">
                      {/* Primary Row: Status + Title */}
                      <div className="mb-2 flex items-center gap-3">
                        {/* Status Lamp */}
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${
                            batch.status === "Open"
                              ? "bg-green-400/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          <span className="relative flex h-2 w-2">
                            {batch.status === "Open" ? (
                              <>
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
                              </>
                            ) : (
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                            )}
                          </span>
                          {batch.status}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-avenir-black mb-1 text-xl text-white transition-colors duration-300 group-hover:text-green-300 sm:text-2xl">
                        {batch.type}
                      </h3>

                      {/* Secondary Info */}
                      <p className="font-lato-regular text-sm text-white/50">
                        {batch.cycle} • Batch {batch.batchYear} • {batch.period}
                      </p>
                    </div>

                    {/* Right Section - Arrow Indicator */}
                    <div className="flex flex-shrink-0 items-center gap-4">
                      <div className="hidden text-right sm:block">
                        <span
                          className={`text-xs font-medium tracking-wide uppercase ${batch.status === "Open" ? "text-green-400" : "text-red-400"}`}
                        >
                          {batch.status === "Open" ? "Apply Now" : "View Details"}
                        </span>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:border-green-300 group-hover:bg-green-300/10">
                        <svg
                          className="h-4 w-4 text-white/60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-green-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Accent Line */}
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full ${batch.status === "Open" ? "bg-green-400" : "bg-red-500"}`}
                  ></div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
