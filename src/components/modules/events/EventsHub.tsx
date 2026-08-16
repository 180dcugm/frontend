import React from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/elements/PageHeader";
import { ArrowRight, Calendar, Users, Briefcase, GraduationCap, Video } from "lucide-react";
import EventLayout from "./layout/EventLayout";
import EventCard from "./components/EventCard";
import { cn } from "@/lib/utils";

const programs = [
  {
    title: "Open Recruitment",
    description: "Join our next batch of driven consultants. Apply now to kickstart your journey.",
    href: "/events/oprec",
    icon: Users,
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1500&auto=format&fit=crop", // collaborative team
    available: false,
  },
  {
    title: "Consulting Bootcamp",
    description:
      "Intensive training program designed to teach core consulting frameworks and skills.",
    href: "/events/bootcamp",
    icon: Briefcase,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1500&auto=format&fit=crop", // workshop/bootcamp setting
    available: false,
  },
  {
    title: "Academy",
    description: "Exclusive educational sessions led by top-tier consultants and industry experts.",
    href: "/events/academy",
    icon: GraduationCap,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1500&auto=format&fit=crop", // lecture/presentation
    available: false,
  },
  {
    title: "Case Competition",
    description:
      "Test your business acumen by solving real-world challenges in our upcoming competitions.",
    href: "/events/casecompetition",
    icon: Calendar,
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1500&auto=format&fit=crop", // team working on computers/data
    available: false,
  },
  {
    title: "Video Case Competition",
    description:
      "Showcase your analytical and presentation skills through a creative video case study.",
    href: "/events/videocasecompetition",
    icon: Video,
    image:
      "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=1500&auto=format&fit=crop", // videography/camera setup
    available: false,
  },
];

export default function EventsHub() {
  return (
    <EventLayout>
      <Container color="transparent" className="relative z-10 pt-4 md:pt-8 lg:pt-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, index) => {
            const isFeatured = index === 0;

            return (
              <EventCard
                key={index}
                title={program.title}
                description={program.description}
                available={program.available}
                href={program.href}
                image={program.image}
                className={cn(
                  "h-[300px] w-full md:h-[350px]",
                  isFeatured ? "md:col-span-2 lg:col-span-2" : "col-span-1"
                )}
              />
            );
          })}
        </div>
      </Container>
    </EventLayout>
  );
}
