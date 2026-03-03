"use client";
import { HomeStore, VisitSpotify, HomeJoinUs } from "@/components/modules/homepage";
import LookForward from "@/components/layout/LookForward";
import AOSInit from "@/components/AOSInit";

export default function Home() {
  return (
    <>
      <AOSInit />
      <HomeStore />
      <VisitSpotify />
      <HomeJoinUs />
      <LookForward theme="dark" />
    </>
  );
}
