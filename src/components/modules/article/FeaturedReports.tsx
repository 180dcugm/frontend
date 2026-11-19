import React from "react";
import Link from "next/link";
import Image from "@/components/elements/ReliableImage";
import Container from "@/components/layout/Container";
import Button180 from "@/components/elements/Button180";
import { ArrowRight } from "lucide-react";

const products = [
  {
    href: "/article/industrialreport/cafe-industries",
    image: "/img/industrialreport/CafeIndusThumb.png",
    alt: "Thumbnail of the Cafe Industry Report",
    title: "Cafe Industry Report",
  },
  {
    href: "/article/industrialreport/tenun-lurik",
    image: "/img/industrialreport/tenunlurikthumb.png",
    alt: "Thumbnail of the Tenun Lurik Report",
    title: "Tenun Lurik Report",
  },
  {
    href: "/article/industrialreport/sustainibility-report",
    image: "/img/industrialreport/SustainableReport.jpg",
    alt: "Thumbnail of the Sustainability Report",
    title: "Sustainability Report",
  },
];

export default function FeaturedReports() {
  return (
    <section id="reports" className="bg-black-300 py-20">
      <Container>
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="font-avenir-black mb-4 text-3xl text-white md:text-4xl">
              <span className="text-green-300">Industrial</span> Reports
            </h2>
            <p className="font-mulish text-gray-300">
              Read comprehensive insights and data-driven analysis of various industries crafted by
              our top consultants.
            </p>
          </div>
          <Button180
            text="View All Reports"
            color="white"
            href="/article/industrialreport"
            icon={<ArrowRight />}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product, index) => (
            <Link
              key={index}
              href={product.href}
              className="group flex flex-col items-start overflow-hidden"
            >
              <div className="relative mb-6 aspect-[11/16] w-[70%] max-w-[280px] overflow-hidden rounded-l-sm rounded-r-lg bg-gray-200 shadow-[8px_0px_15px_rgba(0,0,0,0.15)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[12px_10px_20px_rgba(0,0,0,0.2)]">
                {/* Book spine effect */}
                <div className="absolute inset-y-0 left-0 z-10 w-3 bg-gradient-to-r from-black/20 to-transparent"></div>
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  sizes="(max-width: 767px) 35vw, (max-width: 1023px) 18vw, 200px"
                  className="object-cover"
                />
              </div>
              <div className="flex w-full flex-col text-left">
                <div className="mb-2 flex items-center justify-start text-xs text-gray-400">
                  <span className="font-semibold text-green-300 uppercase">Consulting Report</span>
                </div>
                <h3 className="font-avenir-black text-xl leading-snug text-white transition-colors group-hover:text-green-300">
                  {product.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
