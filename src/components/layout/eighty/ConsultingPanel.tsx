"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, ChevronRight, Sparkles } from "lucide-react";
import { CONSULTING_QUESTIONS } from "@/config/Eighty";
import { specialProducts } from "@/components/modules/store/data/ProductData";

export function ConsultingWelcome({ onQuestion }: { onQuestion: (question: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-green-300/25 bg-gradient-to-br from-green-300/10 to-transparent p-5">
        <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-green-300 uppercase">
          <Sparkles aria-hidden="true" className="size-4" /> Your consulting peer
        </span>
        <h3 className="font-avenir-black text-2xl leading-tight text-white">
          Let’s think through your next case.
        </h3>
        <p className="font-lato-regular mt-3 text-sm leading-relaxed text-gray-300">
          Hi, I’m Eighty. This space is being prepared with 180DC UGM’s Knowledge Team guidebook and
          casebook materials, for consulting and BCC preparation.
        </p>
        <p className="font-lato-regular mt-3 text-xs leading-relaxed text-green-200">
          UI preview · Guided answers will be available once the materials are added.
        </p>
      </div>
      <div>
        <h4 className="font-avenir-heavy mb-3 text-sm text-white">
          Where would you like to start?
        </h4>
        <div className="space-y-2">
          {CONSULTING_QUESTIONS.map((question, index) => (
            <button
              key={question}
              type="button"
              onClick={() => onQuestion(question)}
              className="group bg-black-300 flex w-full cursor-pointer items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-left transition-colors hover:border-green-300/60 hover:bg-green-300/5 focus-visible:outline-2 focus-visible:outline-green-300"
            >
              <span aria-hidden="true" className="font-avenir-heavy text-xs text-green-300/70">
                0{index + 1}
              </span>
              <span className="font-lato-regular flex-1 text-sm leading-relaxed text-gray-200 group-hover:text-green-300">
                {question}
              </span>
              <ChevronRight
                aria-hidden="true"
                className="size-4 shrink-0 text-gray-500 group-hover:text-green-300"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ConsultingResources({ onNavigate }: { onNavigate: () => void }) {
  return (
    <section
      aria-label="Consulting resources"
      className="border-t border-white/10 bg-[#191919] px-4 pt-3 pb-2 sm:px-5"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-avenir-heavy flex items-center gap-2 text-xs text-gray-200">
          <BookOpen aria-hidden="true" className="size-3.5 text-green-300" /> Go further with 180DC
          UGM
        </h3>
        <Link
          href="/store"
          onClick={onNavigate}
          className="font-lato-regular text-[11px] text-green-300 hover:underline"
        >
          Our resources
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {specialProducts.map((product) => (
          <Link
            key={product.id}
            href={`/store?product=${product.id}`}
            onClick={onNavigate}
            aria-label={`Shop ${product.name}`}
            className="group bg-black-300 flex items-center gap-2.5 rounded-xl border border-white/10 p-2.5 transition-colors hover:border-green-300/60 focus-visible:outline-2 focus-visible:outline-green-300"
          >
            <div className="relative hidden size-11 shrink-0 overflow-hidden rounded-lg bg-white/90 min-[360px]:block">
              <Image src={product.image} alt="" fill sizes="44px" className="object-contain p-1" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-avenir-heavy text-xs text-white">{product.name}</p>
              <p className="font-lato-regular mt-0.5 text-[10px] text-gray-400">
                Rp{product.price.toLocaleString("id-ID")}
              </p>
              <span className="font-lato-regular mt-1 flex items-center gap-1 text-[10px] text-green-300">
                View product <ArrowUpRight aria-hidden="true" className="size-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
