"use client";

// Import Packages
import React from "react";
import Image from "next/image";

// Import Configs
import { createBackground } from "@/config/Functions";
import { useState, useEffect, useMemo } from "react";

export default function CasebookJourney() {
  const [windowSize, setWindowSize] = useState(null);

  const handleResize = () => {
    setWindowSize(window.innerWidth);
  };

  useEffect(() => {
    setWindowSize(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const memoizedWindowSize = useMemo(() => windowSize < 768, [windowSize]);
  // Page
  return (
    <section className="relative">
      {/* Background */}
      {createBackground("dark")}

      {/* Content */}
      <div className="flex h-fit w-full items-center justify-center max-lg:py-[8vh] lg:h-screen">
        <Image
          src="/img/store/casebook/bgBlackPatterned2.png"
          alt="180DC UGM Casebook"
          width={2000}
          height={2000}
          className="absolute inset-0 z-0 h-full w-full object-cover max-lg:hidden"
        />
        <Image
          src="/img/store/casebook/bgBlackPatternedMobile.png"
          alt="background"
          width={2000}
          height={2000}
          className="absolute inset-0 z-0 w-full object-cover lg:hidden"
        />

        {/* Desktop */}
        <div className="relative flex flex-col items-center justify-center max-lg:hidden">
          {/* Content */}
          <div className="flex w-full flex-col items-center justify-center">
            <div className="mb-[2vw] flex flex-col items-center justify-center">
              <h1 className="font-avenir-heavy text-[3.333vw]/[3vw] text-white">CASEBOOK</h1>
              <h1 className="font-avenir-heavy text-[3.333vw]/[3vw] text-white">Journey</h1>
            </div>

            <div className="relative ml-[4vw]">
              <Image
                src="/img/store/casebook/LineBeside.png"
                alt="background"
                width={2000}
                height={2000}
                className="absolute top-[3vw] -left-[5vw] z-0 h-[35.313vw] w-[1.446vw] object-cover max-lg:hidden"
              />
              <div className="mb-[2vw] h-[15.625vw] w-[47.917vw] rounded-[1.25vw] bg-white px-[2vw] py-[2vw]">
                <h1 className="font-avenir-black mt-[0.5vw] text-[1.35vw] text-[#6FAA26]">
                  August 2021
                </h1>
                <h1 className="font-avenir-black mt-[0.1vw] text-[1.867vw] text-[#58B9D1]">
                  Our Mini Casebook was published.
                </h1>
                <h1 className="font-lato-regular text-black-300 mt-[0.8vw] w-[42.917vw] text-[1.25vw]/[1.35vw]">
                  180 DC UGM Mini Casebook is our initial version of delivering Consulting 101
                  materials, as well as case interview practices and a step-by-step guide on how to
                  solve a typical business case, which was loved by thousands of you
                </h1>
              </div>

              <div className="mb-[2vw] h-[20.521vw] w-[47.917vw] rounded-[1.25vw] bg-white px-[2vw] py-[2vw]">
                <h1 className="font-avenir-black mt-[0.5vw] text-[1.35vw] text-[#6FAA26]">
                  January 2024 - Now
                </h1>
                <h1 className="font-avenir-black mt-[0.1vw] text-[1.867vw] text-[#58B9D1]">
                  Introducing Casebook Vol.2
                </h1>
                <h1 className="font-lato-regular text-black-300 mt-[0.8vw] w-[42.917vw] text-[1.25vw]/[1.35vw]">
                  Casebook Vol 2 aims to provide a walkthrough for readers on getting into
                  Consulting companies, including CV, Cover Letter, and especially case-based
                  interviews. In this newest version of 180DC UGM’s Casebook, SMEs in Yogyakarta
                  become our subject for our thorough case practices, including market entry,
                  profitability case practices, including market entry, profitability, supply chain
                  efficiency, and employee retention case illustrations.
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="z-2 mt-[6.372vw] mb-[6.372vw] flex w-full flex-col items-center lg:hidden">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="mb-[7vw] flex flex-col items-center justify-center">
              <h1 className="font-avenir-heavy text-[6.154vw]/[6.3vw] text-white">CASEBOOK</h1>
              <h1 className="font-avenir-heavy text-[6.154vw]/[6.3vw] text-white">Journey</h1>
            </div>

            <div className="relative ml-[8vw]">
              <Image
                src="/img/store/casebook/LineBesideMobile.png"
                alt="background"
                width={2000}
                height={2000}
                className="absolute top-[6vw] -left-[7vw] z-0 h-[132.308vw] w-[4.103vw] object-cover lg:hidden"
              />
              <div className="mb-[4vw] h-[54.103vw] w-[79.487vw] rounded-[3.077vw] bg-white px-[5vw] py-[2vw]">
                <h1 className="font-avenir-black mt-[2.5vw] text-[3.377vw] text-[#6FAA26]">
                  August 2021
                </h1>
                <h1 className="font-avenir-black mt-[0.1vw] text-[3.79vw] text-[#58B9D1]">
                  Our Mini Casebook was published.
                </h1>
                <h1 className="font-lato-bold text-black-300 mt-[2.8vw] w-[69.231vw] text-[3.79vw]/[4.5vw]">
                  180 DC UGM Mini Casebook is our initial version of delivering Consulting 101
                  materials, as well as case interview practices and a step-by-step guide on how to
                  solve a typical business case, which was loved by thousands of you
                </h1>
              </div>

              <div className="w-[79.487vw]] mb-[2vw] h-[80.256vw] rounded-[3.077vw] bg-white px-[5vw] py-[2vw]">
                <h1 className="font-avenir-black mt-[2.5vw] text-[3.377vw] text-[#6FAA26]">
                  January 2024 - Now
                </h1>
                <h1 className="font-avenir-black mt-[0.1vw] text-[3.79vw] text-[#58B9D1]">
                  Introducing Casebook Vol.2
                </h1>
                <h1 className="mt-[4.8vw] font-lato-bold text-black-300 w-[69.231vw] text-[3.79vw]/[4.5vw]">
                  Casebook Vol 2 aims to provide a walkthrough for readers on getting into
                  Consulting companies, including CV, Cover Letter, and especially case-based
                  interviews. In this newest version of 180DC UGM’s Casebook, SMEs in Yogyakarta
                  become our subject for our thorough case practices, including market entry,
                  profitability case practices, including market entry, profitability, supply chain
                  efficiency, and employee retention case illustrations.
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
