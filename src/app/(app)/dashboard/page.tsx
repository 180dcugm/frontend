"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/integrations/supabase/client";

const dashboardCards = [
  {
    id: "consulting-cycle-1",
    title: "Consulting Cycle 1",
    description: "Batch 25/26 Cycle 1 recruitment submissions",
    href: "/dashboard/25-26/consulting/cycle1",
    type: "Consulting",
  },
  {
    id: "consulting-cycle-2",
    title: "Consulting Cycle 2",
    description: "Batch 25/26 Cycle 2 recruitment submissions",
    href: "/dashboard/25-26/consulting/cycle2",
    type: "Consulting",
  },
  {
    id: "functional",
    title: "Functional",
    description: "Functional teams & operations management",
    href: "/dashboard/25-26/functional",
    type: "Functional",
  },
  {
    id: "bootcamp-2025",
    title: "Bootcamp 2025",
    description: "Bootcamp registrations & participant data",
    href: "/dashboard/25-26/bootcamp",
    type: "Bootcamp",
  },
];

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return dashboardCards;

    const query = searchQuery.toLowerCase();
    return dashboardCards.filter(
      (card) =>
        card.title.toLowerCase().includes(query) ||
        card.description.toLowerCase().includes(query) ||
        card.type.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  async function handleLogout() {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/dashboard/login");
  }

  return (
    <section className="bg-black-300 relative min-h-screen">
      {/* Background Image */}
      <Image
        src="/img/homepage/balairung.png"
        alt="background"
        width={2000}
        height={2000}
        className="absolute inset-0 z-10 h-full w-full object-cover opacity-30"
      />

      <div className="relative z-20 flex min-h-screen flex-col items-center px-[5%] py-20 sm:px-[10%]">
        <div className="w-full max-w-3xl">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="mb-6 flex items-center justify-center">
              <Image src="/logowhite180.png" width={80} height={80} alt="logo-180" />
            </div>
            <h1 className="font-avenir-black mb-3 text-4xl text-white md:text-5xl">
              Admin <span className="text-green-300">Dashboard</span>
            </h1>
            <p className="font-lato-regular text-lg text-gray-400">Select a management section</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dashboards..."
              className="font-lato-regular bg-black-300/80 w-full rounded-[14px] border-2 border-white/20 py-4 pr-4 pl-12 text-white placeholder-gray-500 transition-all focus:border-green-300 focus:outline-none"
            />
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {filteredCards.length === 0 ? (
              <div className="bg-black-300/80 rounded-[14px] border-2 border-white/10 p-8 text-center backdrop-blur-sm">
                <p className="font-lato-regular text-gray-400">
                  No dashboards found matching your search.
                </p>
              </div>
            ) : (
              filteredCards.map((card) => (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group bg-black-300/80 hover:bg-black-300/90 flex items-center justify-between rounded-[14px] border-2 border-white/10 p-5 backdrop-blur-sm transition-all duration-300 hover:border-green-300/50"
                >
                  {/* Left Content */}
                  <div className="flex-1">
                    <h2 className="font-avenir-black mb-1 text-xl text-white transition-colors group-hover:text-green-300">
                      {card.title}
                    </h2>
                    <p className="font-lato-regular text-sm text-gray-400">{card.description}</p>
                  </div>

                  {/* Right Arrow */}
                  <div className="ml-4 flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-500 transition-all group-hover:translate-x-1 group-hover:text-green-300"
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
                </Link>
              ))
            )}
          </div>

          {/* Store Card */}
          <div className="rounded-lg border-2 bg-white p-6 shadow-md transition-shadow duration-300 hover:border-lime-300 hover:shadow-lg">
            <div className="pb-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-200"></div>
              <h2 className="mb-2 text-2xl font-semibold text-gray-900">180 DC Store</h2>
              <p className="mb-6 text-gray-600">
                Manage store (merchandise, framework, casebook) 180DC UGM
              </p>
            </div>
            <Link href="/dashboard/store">
              <Button
                className="w-full bg-lime-600 py-3 text-lg font-medium text-white hover:bg-lime-700"
                size="lg"
              >
                Access Store
              </Button>
            </Link>
          </div>
        </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="font-lato-regular text-sm text-gray-600">
              Need help? Contact{" "}
              <a href="mailto:admin@180dcugm.id" className="text-green-300 hover:underline">
                admin@180dcugm.id
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
