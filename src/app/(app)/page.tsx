"use client";
import { Hero, OurClients, WhatIs, HomeStore, VisitSpotify, HomeJoinUs } from "@/components/modules/homepage";
import LookForward from "@/components/layout/LookForward";
import { useRef } from "react";

export default function Home() {
  const contactRef = useRef(null);
  return (
    <>
      <Hero contactRef={contactRef} />
      <WhatIs />
      <OurClients />
      <HomeStore />
      <VisitSpotify />
      <HomeJoinUs />
      <LookForward theme="dark" />
    </>
  );
}
